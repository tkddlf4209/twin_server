const io = require("socket.io-client");
const axios = require('axios');
const readline = require('readline');
const { v4: uuidv4 } = require('uuid');
const { clearInterval } = require("timers");
const express = require("express");
const cors = require("cors");
const app = express()
const server = require("http").createServer(app);
const server_io = require("socket.io")(server); // 서버 UI 소켓

const CATALOG_SERVER_URL = "http://localhost:4000"
const SERVER_PORT = getRandomInt(1000,65000);

var server_url;
var user_id;
var twin_id;
var socket;

var randomUserId = function () {
    return Math.random().toString(36).substr(2, 4);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
  }


let twin_info; // 트윈 정보 저장
let entity_info_list; // 엔티티 정보 저장

const socketConnect = () => {
    //var url = window.location.origin;   

    //const socket = io.connect(ADDRESS);

    socket = io(CATALOG_SERVER_URL, {
        transports: ['websocket'],
        reconnection: true,             // whether to reconnect automatically
        reconnectionAttempts: Infinity, // number of reconnection attempts before giving up
        reconnectionDelay: 1000,        // how long to initially wait before attempting a new reconnection
        reconnectionDelayMax: 5000,     // maximum amount of time to wait between reconnection attempts. Each attempt increases the reconnection delay by 2x along with a randomization factor
        randomizationFactor: 0.5,
        extraHeaders: {
            twin_id: twin_id
        }
    });

    console.log('서버 연결 시작');
    socket.on('connect', function () {
        console.log('카탈로그 서버 연결 성공');

        socket.emit("twin_connect", {
            twin_info: twin_info,
            entity_info_list: entity_info_list
        })

    });

    socket.on('disconnect', function () {
        console.log('카탈로그 서버 연결 끊김');

        // if (interval) {
        //     clearInterval(interval);
        //     interval = null;
        // }
    });

    socket.on('message', function (data) {

    });
}

async function getTwinId(user_id) {

    const response = await axios.get(
        `http://localhost:4000/twinId/${user_id}`
    );
    return response.data;
}


const SIM_TYPE_INCREASE = 1;
const SIM_TYPE_DECREASE = 2;
const INTERVAL_MS = 3000;

const CHANGE_VALUE = 0.1;
let interval;
function startSimulation(twin_type, simulation_type){
    clearInterval(interval);
    switch (twin_type) {
        case 1: // 제조 트윈
            interval = setInterval(function() {
                var prcoess = entity_info_list.filter(entity => entity.entity_id ==="process")[0];// 공정 객체
                var tms = entity_info_list.filter(entity => entity.entity_id ==="tms")[0];// TMS 객체
                
                var device_count = prcoess?.props.filter(prop => prop.prop_id ==="device_count")[0];// 가동 장치 수 prop
                if(device_count){
                    if(simulation_type == SIM_TYPE_INCREASE){
                        if( device_count.value +CHANGE_VALUE <= device_count.max){
                            device_count.value +=CHANGE_VALUE;
                        }else if(device_count.value +CHANGE_VALUE > device_count.max){
                            device_count.value =device_count.max;
                        }
    
                        tms?.props.forEach(prop=>{
                            if(device_count.relation_config.tms[prop.prop_id]){
                                // 가동 수 * 가동 수 대비 발생량 곱한 값을 저장 
                                prop.value = device_count.relation_config.tms[prop.prop_id]*device_count.value
                            }
                        })
                    }else{ // 감소 시뮬레이션
                        if( device_count.value -CHANGE_VALUE >= device_count.min){
                            device_count.value -=CHANGE_VALUE;
                        }else if(device_count.value -CHANGE_VALUE < device_count.min){
                            device_count.value =device_count.min;
                        }
    
                        tms?.props.forEach(prop=>{
                            if(device_count.relation_config.tms[prop.prop_id]){
                                // 가동 수 * 가동 수 대비 발생량 곱한 값을 저장 
                                prop.value = device_count.relation_config.tms[prop.prop_id]*device_count.value
                            }
                        })
                    }

                    socket.emit("entity_update", {
                        entity_info_list: entity_info_list
                    })

                    
                }

            }, INTERVAL_MS)
            break;
        case 2: // 에너지 트윈
            interval = setInterval(function() {
                if(simulation_type == SIM_TYPE_INCREASE){

                }else{
                    
                }
            }, INTERVAL_MS)
            break;
        default:
    }

    socket.emit("entity_update", {
        entity_info_list: entity_info_list
    })

}

function startReadline() {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'input > '
    });

    prompt(rl);
    rl.on('line', async (line) => {

        if (init) {
            switch (line.trim()) {
                case '1':
                    if (entity_add === false) {
                        var add_entities = [];
                        switch (twin_type) {
                            case 1: // 제조 트윈
                                add_entities.push(
                                    {
                                        id : uuidv4(),
                                        name: '공정',
                                        entity_id : "process",
                                        type: 'property',
                                        props: [
                                            {
                                                id : uuidv4(),
                                                prop_id :"device_count",
                                                name: "가동 장치 수",
                                                schema: "number",
                                                value: 0, 
                                                min : 0,
                                                max : 10,
                                                relation_config:{ 
                                                    tms:{ // entity_id (key)
                                                        find_dust: 10, //prop_id : value
                                                        co2 : 10 
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                );

                                add_entities.push(
                                    {
                                        id : uuidv4(), // 고유 아이디
                                        entity_id : "tms",
                                        name: 'TMS',
                                        type: 'relation',
                                        props: [
                                            {
                                                id : uuidv4(),
                                                prop_id :"find_dust",
                                                name: "미세먼지(pm2.5)",
                                                schema: "number",
                                                unit: "pm2.5",
                                                value: 0,

                                            },
                                            {
                                                id : uuidv4(),
                                                prop_id :"co2",
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
                                        id : uuidv4(),
                                        name: '발전기',
                                        type: 'property',
                                        props: [
                                            {
                                                id : uuidv4(),
                                                name: "발전기 수",
                                                schema: "number",
                                                value: 0,
                                                min : 0,
                                                max : 10,
                                                relation_config:{ 
                                                    tms:{ // entity_id (key)
                                                        find_dust: 20, //prop_id : value
                                                        co2 : 20 
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                );

                                add_entities.push(
                                    {
                                        id : uuidv4(), // 고유 아이디
                                        entity_id : "tms",
                                        name: 'TMS',
                                        type: 'relation',
                                        props: [
                                            {
                                                id : uuidv4(),
                                                prop_id :"find_dust",
                                                name: "미세먼지(pm2.5)",
                                                schema: "number",
                                                unit: "pm2.5",
                                                value: 0,

                                            },
                                            {
                                                id : uuidv4(),
                                                prop_id :"co2",
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

                            add_entity['source_id'] = twin_id;
                          
                            twin_info.entities.push(add_entity)
                            entity_info_list.push(add_entity)

                            console.log('entity_add',add_entity);
                            socket.emit("entity_add", {
                                entity: add_entity
                            })
                        })


                        console.log('객체를 추가 합니다');
                        entity_add = true;
                    } else {
                        console.log('이미 객체를 추가하였습니다.');
                    }
                    break;
                case '2': // 2: 증가 시뮬래이션 시작
                    startSimulation(twin_type,SIM_TYPE_INCREASE)

                    console.log('증가 시뮬래이션 시작');
                    break;

                case '3': //감소 시뮬래이션 시작

                    startSimulation(twin_type,SIM_TYPE_DECREASE)

                    console.log('감소 시뮬래이션 시작');
                    break;

                case '4':

                    if (twin_info.entities.length > 0 && entity_info_list.length > 0) {
                        twin_info.entities.splice(0, 1);
                        var rm_entity = entity_info_list.splice(0, 1);

                        if (rm_entity.length > 0) {
                            socket.emit("entity_remove", {
                                entity: rm_entity[0]
                            })

                            console.log('첫번째 객체를 삭제 합니다');
                        }
                    }

                    break;
                default:
                    console.log(`${line.trim()} invalid param`);
                    break;
            }
        } else {
            switch (line.trim()) {

                case '1': // 2: 객체 값 변경 (Random)
                    console.log('제조 트윈 선택');
                    init = true;
                    twin_type = 1;
                    break;
                case '2':
                    console.log('에너지 트윈 선택');
                    init = true;
                    twin_type = 2;
                    break;
                default:
                    console.log(`${line.trim()} invalid param`);
                    break;
            }

            if (twin_type > 0) { // 소켓 연결
                server_url = "http://localhost:"+SERVER_PORT;
                user_id = process.argv.slice(2);

                if (user_id.length == 0) {
                    user_id = randomUserId();
                } else {
                    user_id = user_id[0];
                }
                console.log('* 유저 아이디 >>', user_id);

                twin_id = await getTwinId(user_id);
                console.log('* 트윈 아이디 >>', twin_id);
                console.log('* 연결 카탈로그 서버 주소 >>', CATALOG_SERVER_URL);
                console.log('* 현재 트윈 서버 주소 >>', server_url);

                // 기본 객체 초기화
                twin_info = {
                    id: twin_id,
                    name: twin_type === 1 ? "제조 트윈 (" + user_id + ")" : "에너지 트윈 (" + user_id + ")",
                    server_url : server_url,
                    entities: []
                }
                entity_info_list = [];
                socketConnect();
            }
        }
        prompt(rl);

    }).on('close', () => {
        console.log('프로세스를 종료합니다.');
        process.exit(0);
    });
}

var init = false;
var entity_add = false;
var twin_type = 0;

function prompt(readline) {

    if (init == false) {
        console.log('-----------------------------');
        console.log('1: 트윈 종류 선택 (1: 제조, 2: 에너지)');
        console.log('-----------------------------');
    } else {
        console.log('-----------------------------');
        console.log('1: 객체 추가');
        console.log('2: 증가 시뮬레이션');
        console.log('3: 감소 시뮬레이션');
        console.log('4: 객체 삭제 (idx:0)');
        console.log('-----------------------------');
    }

    readline.prompt();
}


let registtPolicy = {}
function startServer(){
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    //2. 웹 서버 가동
    app.use(cors()); // 외부접근 허용
    //app.use(express.static("build"));

    // 1. 트윈아이디 생성 
    app.get("/", function (req, res) {
        res.send(JSON.stringify(twin_info))
    })
        
    // 1. 트윈아이디 생성 
    app.put("/policy", function (req, res) {
        const body = req.body;
        
        console.log("정책등록 수신 및 수락",JSON.stringify(body));
        res.send("OK")

    })


    server.listen(SERVER_PORT, async function () {
        console.log(`application is listening on port@ ${SERVER_PORT}...`);
    });
}


(async function () {
    try {

        startServer();
        setTimeout(() => {
            // 커맨드입력 준비
            startReadline();
        }, 1000);

    } catch (e) {
        console.log(e.message);
    }
})();


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

