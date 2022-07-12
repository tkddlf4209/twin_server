const io = require("socket.io-client");
const axios = require('axios');
const readline = require('readline');
const { v4: uuidv4 } = require('uuid');
const { clearInterval } = require("timers");
const express = require("express");
const cors = require("cors");
//const { updatePolicy } = require("./src/api");
const app = express()
const server = require("http").createServer(app);
const server_io = require("socket.io")(server); // 서버 UI 소켓

const CATALOG_SERVER_URL = "http://localhost:4000"
const SERVER_PORT = getRandomInt(1000, 65000);

var twinName;
var twinType;
var twinId;
var catalog_server_socket;

let twin_info = null; // 트윈 정보 저장
let entity_info_list = []; // 엔티티 정보 저장
let policy_info_list = []; // 정책 정보 저장
let simulation_list = []; // 시뮬레이션 정보

let simulation_interval;
let policy_interval;

let randomUserId = function () {
    return Math.random().toString(36).substr(2, 4);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

const socketConnect = () => {
    //var url = window.location.origin;
    //const socket = io.connect(ADDRESS);

    catalog_server_socket = io(CATALOG_SERVER_URL, {
        transports: ['websocket'],
        reconnection: true,             // whether to reconnect automatically
        reconnectionAttempts: Infinity, // number of reconnection attempts before giving up
        reconnectionDelay: 1000,        // how long to initially wait before attempting a new reconnection
        reconnectionDelayMax: 5000,     // maximum amount of time to wait between reconnection attempts. Each attempt increases the reconnection delay by 2x along with a randomization factor
        randomizationFactor: 0.5,
        extraHeaders: {
            twin_id: twinId
        }
    });

    console.log('서버 연결 시작');
    catalog_server_socket.on('connect', function () {
        console.log('카탈로그 서버 연결 성공');

        catalog_server_socket.emit("twin_connect", {
            twin_info: twin_info,
            entity_info_list: entity_info_list
        })

    });

    catalog_server_socket.on('disconnect', function () {
        console.log('카탈로그 서버 연결 끊김');
        // if (interval) {
        //     clearInterval(interval);
        //     interval = null;
        // }
    });

    catalog_server_socket.on('message', function (data) {

    });
}

async function getTwinId(twin_name) {

    const response = await axios.get(
        `http://localhost:4000/twinId/${twin_name}`
    );
    return response.data;
}

function startServer() {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    //2. 웹 서버 가동
    app.use(cors()); // 외부접근 허용
    app.use(express.static("./build"));

    // app.get("/", function (req, res) {
    //     res.send(JSON.stringify(twin_info))
    // })

    // 트윈 초기화 상태 조회 
    app.get("/init", function (req, res) {

        if (twin_info && catalog_server_socket !== null) {
            socketConnect();
        }

        // 트윈정보가 없는 경우 초기화를 진행해야함.
        res.send(JSON.stringify({
            result: twin_info !== null
        }))
    })

    // 트윈 초기화  
    app.put("/init", async function (req, res) {

        // 이미 초기화된 경우.
        if (twin_info) {
            res.send(JSON.stringify({
                result: 1
            }))
            return;
        }

        var { twin_type, twin_name } = req.body;

        if (twin_name === null || twin_name === "") {
            twinName = randomUserId();
        } else {
            twinName = twin_name;
        }

        try {
            // 카탈로그 서버에서 트윈 아이디 가져오기
            twinId = await getTwinId(twinName);
        } catch (e) {
            res.send(JSON.stringify({
                result: 0,
                msg: e.message
            }))
            return;
        }

        twinType = Number(twin_type) // 1: 제조 , 2:에너지

        twin_info = {
            id: twinId,
            name: twinName,
            type: twinType,
            server_url: "http://localhost:" + SERVER_PORT,
            entities: [],
            policy_info: {} // 카탈로그 서버에서 시작한 정책 정보를 저장한다, //정책 완료 시 제거 된다.// 목표값 등이 저장된다. 
        }

        initEntities(twinType, twinId);
        initSimulation(twinType);
        // 모든 웹 UI 소켓에 초기화된 트윈정보를 전달한다.
        if (twin_info) {
            sendMessage(JSON.stringify({
                type: "TWIN_INIT",
                data: {
                    twin_info: twin_info,
                    entity_info_list: entity_info_list,
                    policy_info_list: policy_info_list,
                    simulation_list: simulation_list
                }
            }))
        }

        // 카탈로그 서버와 연결되어있지 않으면 연결 시작
        if (catalog_server_socket === null) {
            socketConnect();
        }

        res.send(JSON.stringify({
            result: 1
        }))
    })


    // 트윈 초기화  
    app.get("/entities", async function (req, res) {

        if (twin_info) {
            res.send(JSON.stringify({
                result: 1
            }))
        }
    })

    app.put("/policy", function (req, res) {
        const newPolicy = req.body;
        console.log(newPolicy, twinId);
        // 연관트윈에 포함되어있는 경우.
        if (newPolicy.twinIds.includes(twinId)) {
            // 정책에 가입된 경우 변경 사항을 저장한다.
            if (policy_info_list.some(policy => policy.id === newPolicy.id)) {
                policy_info_list = policy_info_list.map(policy => {
                    if (policy.id === newPolicy.id) {
                        return newPolicy;
                    } else {
                        return policy
                    }
                })
            } else {
                // 연합 중인 정책 추가
                policy_info_list.push(newPolicy)
            }

        } else {
            //연관트윈에 포함되어 있지 않은 경우 정책 제거
            policy_info_list = policy_info_list.filter(policy => policy.id !== newPolicy.id);
        }

        sendMessage(JSON.stringify({
            type: "TWIN_POLICY_UPDATE",
            data: {
                policy_info_list: policy_info_list
            }
        }))

        res.send("OK")
    })

    app.put("/policyExcute", function (req, res) {
        const data = req.body;

        const { type, policy_info } = data;
        const { id } = policy_info;

        console.log('policyExcute', id);

        // 정책 참여트윈이 정책 실행
        if (type === 'start') {

            const { id, duration, policy_config } = policy_info; // 실행 정책 아이디 , 주기 , 타겟 값이 포함되어있다.
            policy_info_list = policy_info_list.map(policy => {
                if (policy.id === id) {
                    policy.enable = true;
                }
                return policy
            })

            twin_info.policy_info[id] = policy_config;  // 정책 목표 값을 저장한다.

            sendMessage(JSON.stringify({
                type: "TWIN_POLICY_START",
                data: {
                    policy_info_list: policy_info_list,
                    twin_info: twin_info
                }
            }))
            simulationPolicy(policy_info, true);

            // catalog_server_socket.emit("twin_info_update", {
            //     twin_info: twin_info
            // })

            res.send(JSON.stringify(twin_info))
        } else {

            // 정책 참여트윈이 정책 정지
            policy_info_list = policy_info_list.map(policy => {
                if (policy.id === id) {
                    policy.enable = false;
                }
                return policy
            })

            if (twin_info && twin_info.policy_info && twin_info.policy_info[id]) {
                delete twin_info.policy_info[id]
            }

            sendMessage(JSON.stringify({
                type: "TWIN_POLICY_STOP",
                data: {
                    policy_info_list: policy_info_list,
                    twin_info: twin_info
                }
            }))

            simulationPolicy(policy_info, false);
            res.send(JSON.stringify(twin_info))

        }

    })

    app.put("/policyDelete", function (req, res) {

        // 정책에 참여하지 않은 트윈인 경우 카탈로그 서버에서 시작/정지시 정책리스트에서 제거합니다!

        const data = req.body;
        const { policy_info } = data;
        const { id } = policy_info;

        policy_info_list = policy_info_list.filter(policy => {
            return policy.id !== id
        })

        if (twin_info && twin_info.policy_info && twin_info.policy_info[id]) {
            delete twin_info.policy_info[id]
        }

        simulationPolicy(policy_info, false);
        res.send(JSON.stringify(twin_info))

    })

    app.put("/entity", function (req, res) {
        const body = req.body;

        if (body.data) {
            var { id, enable } = body.data
            var entity = entity_info_list.find(entity => entity.id === id);

            if (entity) {
                entity.enable = enable;
                //console.log(entity);
                sendMessage(JSON.stringify({
                    type: "TWIN_ENTITY_UPDATE",
                    data: entity
                }))

                catalog_server_socket.emit("entity_info_list_update", {
                    entity_info_list: entity_info_list
                })

            }
        }
        res.send("OK")
    })


    app.put("/entityEdit", function (req, res) {
        const newEntity = req.body;
        if (newEntity) {
            entity_info_list = entity_info_list.map(entity => {
                if (entity.id === newEntity.id) {

                    return newEntity;
                } else {
                    return entity;
                }
            })

            sendMessage(JSON.stringify({
                type: "TWIN_ENTITY_UPDATE",
                data: newEntity
            }))

            catalog_server_socket.emit("entity_info_list_update", {
                entity_info_list: entity_info_list
            })
        }
        res.send("OK")
    })

    app.put("/simulation", function (req, res) {
        const newSimulation = req.body.data;
        if (newSimulation) {
            simulation_list = simulation_list.map(simulation => {
                if (simulation.id === newSimulation.id) {
                    return newSimulation;
                } else {
                    return simulation;
                }
            })

            sendMessage(JSON.stringify({
                type: "TWIN_SIMULATION_UPDATE",
                data: {
                    simulation_list: simulation_list
                }
            }))
        }


        simulationUpdate();
        res.send("OK")
    })

    server.listen(SERVER_PORT, async function () {
        console.log(`application is listening on port@ ${SERVER_PORT}`);
    });

    // 트윈 UI 서버
    server_io.on("connection", (socket) => {

        socket.on("disconnect", () => {

        })

        if (twin_info) {
            sendMessage(JSON.stringify({
                type: "TWIN_INIT",
                data: {
                    twin_info: twin_info,
                    entity_info_list: entity_info_list,
                    policy_info_list: policy_info_list,
                    simulation_list: simulation_list
                }
            }), socket)
        }

    });
}

function simulationPolicy(policy_info, run) {
    if (policy_interval) {
        stopPolicy();
    }

    if (run) {
        startPolicy(policy_info);
    }
}

function stopPolicy() {
    if (policy_interval) {
        clearInterval(policy_interval);
        policy_interval = null;
    }
}

function calDeviceCount(policy_config) {
    // 계절관리제에서 정책 config의 목표 달성을 위한 장치갯수 값을 산출한다. 최소로 측정한다.

    let device_count_prop = entity_info_list.find(entity => entity.entity_id === 'process')?.props.find(prop => prop.prop_id === 'device_count');

    let device_count = device_count_prop.value;
    const relation = device_count_prop.relation[0]; // tms config

    const { relation_config } = relation;

    entity_info_list.forEach(entity => {
        entity.props.forEach(prop => {
            if (policy_config[prop.prop_id]) {
                switch (prop.prop_id) {
                    // case "device_count":
                    //     device_count = Math.min(device_count, policy_config[prop.prop_id]); // 
                    //     console.log('ttt', device_count);
                    //     break;
                    case "find_dust":
                    case "co2":
                        device_count = Math.min(device_count, policy_config[prop.prop_id] / relation_config[prop.prop_id]);
                        break;
                    default:
                }
            }
        })
    })

    return device_count;

}

function startPolicy(policy_info) {

    const { id, policy_config, duration } = policy_info;
    console.log('startPolicy', policy_info);
    if (id === 1) { // 계절관리제
        if (twinType === 1) { // 제조 트윈
            let TARGET_VLAUE_DEVICE_COUNT = calDeviceCount(policy_config); // 
            policy_interval = setInterval(() => {
                let target_entity = entity_info_list.find(entity => entity.entity_id === 'process');
                let target_prop = target_entity.props.find(prop => prop.prop_id === 'device_count');
                // 프로퍼티 값을 변경한다.


                updateProp(target_prop, TARGET_VLAUE_DEVICE_COUNT);

                sendMessage(JSON.stringify({
                    type: "TWIN_ENTITY_UPDATE",
                    data: target_entity
                }))

                catalog_server_socket.emit("entity_update", {
                    entity: target_entity
                })

                if (target_prop.value === TARGET_VLAUE_DEVICE_COUNT) {

                }

            }, duration)
        }

    }

}


function simulationUpdate() {
    if (simulation_interval) {
        stopSimulation();
    }

    // 활성화된 시뮬레이션 찾기
    let config = simulation_list.find(simulation => simulation.enable);

    if (config) {
        startSimulation(config);
    }
}

function stopSimulation() {
    if (simulation_interval) {
        clearInterval(simulation_interval);
        simulation_interval = null;
    }
}


function updateProp(target_prop, target_value) {
    // 타겟 값보다 작은 경우
    if (target_prop.value < target_value) {
        let updateValue = target_prop.value + CHANGE_VALUE;


        if (updateValue < target_value) {
            target_prop.value = Number(updateValue.toFixed(1));
        } else {
            target_prop.value = Number(target_value.toFixed(1));
        }
    }


    // 타겟 값보다 큰 경우
    if (target_prop.value > target_value) {

        let updateValue = target_prop.value - CHANGE_VALUE;
        if (updateValue > target_value) {
            target_prop.value = updateValue;
        } else {
            target_prop.value = target_value;
        }
    }

    if (target_prop.relation) {
        target_prop.relation.forEach(relation => {

            let relation_entity = entity_info_list.find(entity => entity.enable && entity.entity_id === relation.relation_entity_id);
            if (relation_entity) {
                relation_entity.props.forEach(prop => {
                    if (relation.relation_config[prop.prop_id]) {
                        let config_value = relation.relation_config[prop.prop_id];
                        prop.value = Number((target_prop.value * config_value).toFixed(1));
                    }
                })

                sendMessage(JSON.stringify({
                    type: "TWIN_ENTITY_UPDATE",
                    data: relation_entity
                }))

                catalog_server_socket.emit("entity_update", {
                    entity: relation_entity
                })
            }
        })
    }
}

let CHANGE_VALUE = 0.1;
function startSimulation(config) {
    simulation_interval = setInterval(() => {

        if (policy_interval) {
            //정책이 실행중이면 시뮬레이션은 동작하지 않습니다.
            return;
        }

        let target_entity_id = config.entity_id;
        let target_prop_id = config.prop_id;
        let target_value = config.target_value; // 목표값

        let target_entity = entity_info_list.find(entity => entity.enable && entity.entity_id === target_entity_id);
        if (target_entity) {
            let target_prop = target_entity.props.find(prop => prop.prop_id === target_prop_id)

            // 프로퍼티 값을 변경한다.
            updateProp(target_prop, target_value);

            sendMessage(JSON.stringify({
                type: "TWIN_ENTITY_UPDATE",
                data: target_entity
            }))

            catalog_server_socket.emit("entity_update", {
                entity: target_entity
            })
        }

    }, 3000);
}


function sendMessage(data, socket) {
    if (socket) {
        socket.emit('message', data);
    } else {
        server_io.sockets.emit('message', data);
    }
}
function initSimulation(twinType) {
    switch (twinType) {
        case 1: // 제조 트윈
            simulation_list.push({
                id: uuidv4(),
                enable: false, // 시작 상태
                title: "가동 장치 수 증가",
                entity_id: "process", // 엔티티 상태조회 용
                prop_id: "device_count", // 프로퍼티 상태 및 관련 Config 값 조회 용
                target_value: 0
            })

            simulation_list.push({
                id: uuidv4(),
                enable: false, // 시작 상태 (동일한 객체 하나만 실행가능)
                title: "가동 장치 수 감소",
                entity_id: "process", // 엔티티 상태조회 용
                prop_id: "device_count", // 프로퍼티 상태 및 관련 Config 값 조회 용
                target_value: 0
            })
            break;
        case 2: // 에너지 트윈
            simulation_list.push({
                id: uuidv4(),
                enable: false, // 시작 상태
                title: "가동 장치 수 증가",
                entity_id: "generator", // 엔티티 상태조회 용
                prop_id: "generator_count", // 프로퍼티 상태 및 관련 Config 값 조회 용
                target_value: 0
            })

            simulation_list.push({
                id: uuidv4(),
                enable: false, // 시작 상태 (동일한 객체 하나만 실행가능)
                title: "가동 장치 수 감소",
                entity_id: "generator", // 엔티티 상태조회 용
                prop_id: "generator_count", // 프로퍼티 상태 및 관련 Config 값 조회 용
                target_value: 0
            })
            break;
        default:
    }
}

function initEntities(twinType, twinId) {

    var add_entities = [];

    switch (twinType) {
        case 1: // 제조 트윈
            add_entities.push(
                {
                    id: uuidv4(),
                    enable: false, // 객체 활성화 여부
                    name: '공정',
                    entity_id: "process",
                    type: 'property',
                    props: [
                        {
                            id: uuidv4(),
                            prop_id: "device_count",
                            name: "가동 장치 수",
                            schema: "number",
                            value: 0,
                            min: 0,
                            max: 10,
                            relation: [
                                {
                                    desc: "가동 장치 수 대비 오염물질 발생량",
                                    relation_entity_id: "tms",
                                    relation_config: {
                                        find_dust: 20,
                                        co2: 20
                                    }
                                }
                            ]
                        }
                    ]
                }
            );

            add_entities.push(
                {
                    id: uuidv4(), // 고유 아이디
                    enable: false, // 객체 활성화 여부
                    entity_id: "tms",
                    name: 'TMS',
                    type: 'relation',
                    props: [
                        {
                            id: uuidv4(),
                            prop_id: "find_dust",
                            name: "미세먼지(pm2.5)",
                            schema: "number",
                            unit: "pm2.5",
                            value: 0,

                        },
                        {
                            id: uuidv4(),
                            prop_id: "co2",
                            name: "이산화탄소",
                            schema: "number",
                            unit: "co2",
                            value: 0
                        }
                    ]
                }
            )
            break;
        case 2: // 에너지 트윈
            add_entities.push(
                {
                    id: uuidv4(),
                    enable: false, // 객체 활성화 여부
                    name: 'generator',
                    entity_id: "power",
                    type: 'property',
                    props: [
                        {
                            id: uuidv4(),
                            prop_id: "generator_count",
                            name: "발전기 수",
                            schema: "number",
                            value: 0,
                            min: 0,
                            max: 10,
                            relation: [
                                {
                                    desc: "발전기 수 대비 오염물질 발생량",
                                    relation_entity_id: "tms",
                                    relation_config: {
                                        find_dust: 20,
                                        co2: 20
                                    }
                                }
                            ]
                        }
                    ]
                }
            );

            add_entities.push(
                {
                    id: uuidv4(), // 고유 아이디
                    enable: false, // 객체 활성화 여부
                    entity_id: "tms",
                    name: 'TMS',
                    type: 'relation',
                    props: [
                        {
                            id: uuidv4(),
                            prop_id: "find_dust",
                            name: "미세먼지(pm2.5)",
                            schema: "number",
                            unit: "pm2.5",
                            value: 0,

                        },
                        {
                            id: uuidv4(),
                            prop_id: "co2",
                            name: "이산화탄소",
                            schema: "number",
                            unit: "co2",
                            value: 0
                        }
                    ]
                }
            )
            break;
        default:
    }

    add_entities.forEach((add_entity, idx) => {

        add_entity['source_id'] = twinId;

        twin_info.entities.push(add_entity)
        entity_info_list.push(add_entity)


        //console.log('entity_add',add_entity);
        // socket.emit("entity_add", {
        //     entity: add_entity
        // })
    })

}


(async function () {
    try {

        startServer();

        // setTimeout(() => {
        //     // 커맨드입력 준비
        //     startReadline();
        // }, 1000);

    } catch (e) {
        console.log(e.message);
    }
})();
