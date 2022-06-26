import React , {useState, useEffect,useMemo , useCallback,useRef}from 'react'
import "./twinManage.scss"
import {DataGrid} from '@mui/x-data-grid'
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { useUsersState, useUsersDispatch ,API} from '../../../UsersContext';

const twin_columns = [
    { field: "id", headerName: "Twin ID", width:350 },
    { field: "name", headerName: "Twin Name", width: 200},
    { field: "status", headerName: "Status", width: 100,
    renderCell : (params) =>{
        return (
            <>
                <p style={params.row.status==="connect"?{color:"green"}:{color:"red"}}>{params.row.status}</p>
            </>
        )
    }},
    { field: "server_url", headerName: "ServerUrl", width: 250},
    { field: "action", headerName: "Action", width: 100 ,
    renderCell : (params) =>{
        return (
            <>
                <DeleteOutline  onClick={()=>API.removeTwin({
                    data :params.row
                })}/> 
            </>
        )
    } }
];


export default React.memo(function Dashboard(){

    const state = useUsersState();
    const dispatch = useUsersDispatch();
    const { twin_infos} = state; 

    const getTwinList = useMemo(()  =>{
        
        var list = [];
        for (const [id, twin] of Object.entries(twin_infos)) {
            list.push(twin);
        }
        return list;

    },[twin_infos]);
   
    return (
        <div className='twinManage'>
            <h1 >트윈관리</h1>
            <DataGrid
                        rows={getTwinList}
                        columns = {twin_columns}
                        pageSize = {20}
                        autoHeight
                        // checkboxSelection
                        onRowClick={(param)=>{
                        }}
                        onSelectionModelChange ={(ids)=>{
                        }}
             />
           
           
        </div>
    )
});