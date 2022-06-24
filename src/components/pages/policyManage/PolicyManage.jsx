import React, { useRef, useState } from 'react';
import './policyManage.scss'
import {Link} from 'react-router-dom';
import PolicyManageItem from './PolicyManageItem';
import {DataGrid} from '@mui/x-data-grid'

import { useUsersState, useUsersDispatch} from '../../../UsersContext';
import {PermIdentity,CalendarToday,PhoneIphone,MailOutline,LocationOn,Publish} from '@mui/icons-material';

const log_columns = [
    { field: "id", headerName: "Id", width: 150 },
    { field: "timestamp", headerName: "Time", width: 150 },
    { field: "type", headerName: "type", width: 150 },
    { field: "data", headerName: "data",  flex: 1,// minWidth: 100
    renderCell : (params) =>{
        return (
            <>
                <p >{JSON.stringify(params.row.data)}</p>
            </>
        )
    }}
];


export default function PolicyManage(){

    const state = useUsersState();
    const dispatch = useUsersDispatch();
    const { policy_infos } = state; 


    return (
        <div className='policy'>
            <h1 >Policy Management</h1>
            <div className='policyContainer'>
                {Object.keys(policy_infos).map((key, idx)=> {
                    var policy = policy_infos[key];
                     return  <PolicyManageItem policy={policy}/>
                    })}
               
                {/* <PolicyManageItem data={{title:"재난상황", poilcy_id :2}}/> */}
            </div> 
            
            <div className='policyCardBackgound' style={{height:600,marginTop:7}}>
                    EventLog
                    <DataGrid
                        rows={[{id:0}]}
                        columns = {log_columns}
                        pageSize = {20}
                        // checkboxSelection
                        onRowClick={(param)=>{
                            //nodeFocusTableHandler(param.row);
                            //console.log(JSON.stringify(param.row));
                        }}
                        onSelectionModelChange ={(ids)=>{
                           // setTwinSelectId(ids[0]);
                        }}
                    />
            </div>
        </div>
    )
}