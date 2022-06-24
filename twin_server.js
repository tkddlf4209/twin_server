const io = require("socket.io-client");
const axios = require('axios');
const readline = require('readline');
const { v4: uuidv4 } = require('uuid');
var user_id;
var twin_id;
var url = "http://localhost:4000"
var socket;

var randomUserId = function () {
    return Math.random().toString(36).substr(2, 4);
}

let twin_info; // 트윈 정보 저장
let entity_info_list; // 엔티티 정보 저장

const socketConnect = () => {
    //var url = window.location.origin;   

    //const socket = io.connect(ADDRESS);

    socket = io(url, {
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
                                        name: '공정',
                                        type: 'property',
                                        props: [
                                            {
                                                name: "가동 장치 수",
                                                schema: "Number",
                                                value: 0
                                            }
                                        ]
                                    }
                                );

                                add_entities.push(
                                    {
                                        name: 'TMS',
                                        type: 'relation',
                                        props: [
                                            {
                                                name: "pm2_5",
                                                schema: "Number",
                                                unit: "pm2.5",
                                                value: 0,

                                            },
                                            {
                                                name: "co2",
                                                schema: "Number",
                                                unit: "co2",
                                                value: 0
                                            }
                                        ]
                                    }
                                )
                                break;
                            case 2: // 에너지 트윈
                                break;
                            default:
                        }

                        add_entities.forEach((add_entity, idx) => {
                            var entity = {
                                id: uuidv4(),
                                source_id: twin_id,
                                name: add_entity.name,
                                type: add_entity.type,
                                props: add_entity.props,
                                config: add_entity.config
                            };

                            twin_info.entities.push(entity)
                            entity_info_list.push(entity)

                            socket.emit("entity_add", {
                                entity: entity
                            })
                        })

                        console.log('객체를 추가 합니다');
                        entity_add = true;
                    } else {
                        console.log('이미 객체를 추가하였습니다.');
                    }
                    break;
                case '2': // 2: 객체 값 변경 (Random)

                    switch (twin_type) {
                        case 1: // 제조 트윈


                            let 가동장치수 = entity_info_list.find(entity => entity.name === "공정").props.find(prop => prop.name === "가동 장치 수");
                            가동장치수.value = 가동장치수.value + 0.1

                            break;
                        case 2: // 에너지 트윈
                            break;
                        default:
                    }
                    socket.emit("entity_update", {
                        entity_info_list: entity_info_list
                    })

                    console.log('객체 정보를 변경 합니다');
                    break;

                case '3':

                    if (twin_info.entities.length > 0 && entity_info_list.length > 0) {
                        twin_info.entities.splice(0, 1);
                        var rm_entity = entity_info_list.splice(0, 1);

                        if (rm_entity.length > 0) {
                            socket.emit("entity_remove", {
                                entity: rm_entity[0]
                            })

                            console.log('객체를 삭제 합니다');
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
                user_id = process.argv.slice(2);

                if (user_id.length == 0) {
                    user_id = randomUserId();
                } else {
                    user_id = user_id[0];
                }
                console.log('* 유저 아이디 >>', user_id);

                twin_id = await getTwinId(user_id);
                console.log('* 트윈 아이디 >>', twin_id);
                console.log('* 카탈로그 서버 주소 >>', url);

                // 기본 객체 초기화
                twin_info = {
                    id: twin_id,
                    name: twin_type === 1 ? "제조 트윈 (" + user_id + ")" : "에너지 트윈 (" + user_id + ")",
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
        console.log('2: 객체 값 변경');
        console.log('3: 객체 삭제 (idx:0)');
        console.log('-----------------------------');
    }

    readline.prompt();
}

(async function () {
    try {

        setTimeout(() => {
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

