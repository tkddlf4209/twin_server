import React, { createContext, useReducer, useContext } from 'react';
import {
    createAsyncDispatcher,
    createAsyncHandler,
    initialAsyncState
} from './asyncActionUtils';
import * as api from './api'; // api 파일에서 내보낸 모든 함수들을 불러옴
import moment from "moment"

var log_idx = 0;
// UsersContext 에서 사용 할 기본 상태
const initialState = {
    twin_info: null,
    entity_info_list: [],
    policy_info_list: [],
    simulation_list: [],
    socket_status: 'disconnect'
};

const usersHandler = createAsyncHandler('GET_USERS', 'users');
const userHandler = createAsyncHandler('GET_USER', 'user');

function timestamp() {
    return moment(new Date()).format("HH:mm:ss")
}

// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
function usersReducer(state, action) { // 2

    switch (action.type) {
        case 'SOCKET_STATUS': // 트윈 서버와의 연결상태
            return {
                ...state,
                socket_status: action.socket_status
            };

        case 'SOCKET_MESSAGE':
            const type = action.data.type;
            const data = action.data.data;
            //console.log(state.event_logs);
            switch (type) {

                case "TWIN_INIT": // 트윈 정보 추가 및 갱신
                    console.log(data);
                    return {
                        ...state,
                        twin_info: data.twin_info,
                        entity_info_list: data.entity_info_list,
                        policy_info_list: data.policy_info_list,
                        simulation_list: data.simulation_list
                    }
                case "TWIN_ENTITY_UPDATE":
                    let { id } = data;
                    return {
                        ...state,
                        entity_info_list: state.entity_info_list.map(entity => {
                            if (entity.id === id) {
                                return data;
                            } else {
                                return entity;
                            }
                        })
                    }
                case "TWIN_POLICY_UPDATE":
                    return {
                        ...state,
                        policy_info_list: data.policy_info_list
                    }

                case "TWIN_POLICY_START":
                    return {
                        ...state,
                        policy_info_list: data.policy_info_list,
                        twin_info: data.twin_info
                    }
                case "TWIN_POLICY_STOP":
                    return {
                        ...state,
                        policy_info_list: data.policy_info_list,
                        twin_info: data.twin_info
                    }
                case "TWIN_SIMULATION_UPDATE":
                    return {
                        ...state,
                        simulation_list: data.simulation_list
                    }
                default:
                    throw new Error(`Unhanded action type: ${action.type}`);
            }
        default:
            throw new Error(`Unhanded action type: ${action.type}`);
    }
}

// State 용 Context 와 Dispatch 용 Context 따로 만들어주기
const UsersStateContext = createContext(null);
const UsersDispatchContext = createContext(null);

// 위에서 선언한 두가지 Context 들의 Provider 로 감싸주는 컴포넌트
export function UsersProvider({ children }) {
    const [state, dispatch] = useReducer(usersReducer, initialState);
    return (
        <UsersStateContext.Provider value={state}>
            <UsersDispatchContext.Provider value={dispatch}>
                {children}
            </UsersDispatchContext.Provider>
        </UsersStateContext.Provider>
    );
}

// State 를 쉽게 조회 할 수 있게 해주는 커스텀 Hook
export function useUsersState() {
    const state = useContext(UsersStateContext);
    if (!state) {
        throw new Error('Cannot find UsersProvider');
    }
    return state;
}

// Dispatch 를 쉽게 사용 할 수 있게 해주는 커스텀 Hook
export function useUsersDispatch() {
    const dispatch = useContext(UsersDispatchContext);
    if (!dispatch) {
        throw new Error('Cannot find UsersProvider');
    }
    return dispatch;
}

export const getUsers = createAsyncDispatcher('GET_USERS', api.getUsers); // 1 , action 실행
export const getUser = createAsyncDispatcher('GET_USER', api.getUser);
export const API = api;
