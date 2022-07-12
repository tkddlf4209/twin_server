import React , {useState, useEffect,useMemo , useCallback,useRef}from 'react'
import Stack from '@mui/material/Stack';
//import { ForceGraph2D  } from 'react-force-graph';
import "./PolicyManage.scss"
import {DataGrid} from '@mui/x-data-grid'
import Switch  from '@mui/material/Switch';
// import {
//     CSS2DRenderer,
//     CSS2DObject
// } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { useUsersState, useUsersDispatch, API} from '../../../UsersContext';
import { MpRounded } from '@mui/icons-material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';

import ReactJson from 'react-json-view'


function NoRowsOverlay() {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
            연합 중인 정책이 없습니다        
      </Stack>
    );
  }

  

const policy_colums = [
    // { field: "enable", headerName: "객체 활성화", width: 150   ,
    // renderCell : (params) =>{
    //     return (
    //         <>
    //             <Switch  checked={params.row.enable}  onClick={()=>API.updateEntity({
    //                 data :{...params.row,enable:!params.row.enable}
    //             })}/> 
    //         </>
    //     )
    // }},
    { field: "id", headerName: "ID", width: 50 },
    { field: "title", headerName: "정책명", width: 150 },
    { field: "enable", headerName: "실행상태", width: 150 ,
    renderCell : (params) =>{
        return (
            <>
                <p style={params.row.enable?{color:'green'}:{color:'grey'}}>{params.row.enable?"실행중":"대기중"}</p>
            </>
        )
    }},
    { field: "duration", headerName: "주기", width: 150  },
    { field: "twinIds", headerName: "연합트윈 수", width: 150   ,
    renderCell : (params) =>{
        return (
            <>
                <p>{params.row.twinIds.length}</p>
            </>
        )
    }}
    // { field: "data", headerName: "data",  flex: 1,// minWidth: 100
    // renderCell : (params) =>{
    //     return (
    //         <>
    //             <p >{JSON.stringify(params.row.data)}</p>
    //         </>
    //     )
    // }}
];

export default React.memo(function EntityManage(){

    const state = useUsersState();
    const dispatch = useUsersDispatch();

    const {policy_info_list } = state;
    const [policyId , setPolicyId] = useState(null)

    //console.log(state);
    const getData = useMemo(()  =>{
        
        let policy = null;
        if(policyId){
            policy =  policy_info_list?.find(policy=> policy.id === policyId);
        }

        if(policy){
            return policy
        }else{
            return {}
        }

        
    },[policy_info_list,policyId]);

    return (
        <div className='policyManage'>
            <h1 >Policy Manage</h1>
            <div className='policyManage_wrap'>
                <div className='policyManage_wrap_left'>
                    <DataGrid
                            rows={policy_info_list?policy_info_list:[]}
                            columns = {policy_colums}
                            pageSize = {20}
                            autoHeight               
                            onRowClick={(param)=>{
                                setPolicyId(param.row.id)
                                //nodeFocusTableHandler(param.row);
                                //console.log(JSON.stringify(param.row));
                            }}
                            onSelectionModelChange ={(ids)=>{
                            // setTwinSelectId(ids[0]);
                            }}
                            components={{ NoRowsOverlay}}
                        />

                        
                
                </div>
                <ReactJson 
                    theme="monokai" //solarized
                    src={getData} 
                    name={"policy"} 
                    indentWidth={4}
                    style={{width:500}}
                    iconStyle={"square"} 
                    collapsed={false} />
               
            </div>
           
           
        </div>
    )
});