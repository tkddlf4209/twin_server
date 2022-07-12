import React , {useState, useEffect, useCallback,useRef}from 'react'
import io from "socket.io-client";
import { useUsersState, useUsersDispatch } from '../../UsersContext';


export default function WebSocket(){
    const state = useUsersState();
    const dispatch = useUsersDispatch();

    useEffect(()=>{

        const socketConnect = () =>{
            var url = window.location.origin;   
            //var url = "http://localhost:2000"
            //const socket = io.connect(ADDRESS);
        
            var socket = io(url, {
                transports: ['websocket'],
                reconnection: true,             // whether to reconnect automatically
                reconnectionAttempts: Infinity, // number of reconnection attempts before giving up
                reconnectionDelay: 1000,        // how long to initially wait before attempting a new reconnection
                reconnectionDelayMax: 5000,     // maximum amount of time to wait between reconnection attempts. Each attempt increases the reconnection delay by 2x along with a randomization factor
                randomizationFactor: 0.5
            });
            
            socket.on('connect', function () {
                dispatch({ type: 'SOCKET_STATUS' , socket_status: 'connect'});
            });

            socket.on('disconnect', function () {
                dispatch({ type: 'SOCKET_STATUS' , socket_status: 'disconnect'});
            });

            socket.on('message', function (data) {
                dispatch({ type: 'SOCKET_MESSAGE' ,data: JSON.parse(data)});
            });
        }

        socketConnect();

    },[]);

    return (
        <>
        </>
    )
}