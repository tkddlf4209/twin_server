import React , {useState, useEffect,useMemo , useCallback,useRef}from 'react'
//import { ForceGraph2D  } from 'react-force-graph';
import "./dashboard.scss"
import {DataGrid} from '@mui/x-data-grid'
// import {
//     CSS2DRenderer,
//     CSS2DObject
// } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { useUsersState, useUsersDispatch, API} from '../../../UsersContext';
import { MpRounded } from '@mui/icons-material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EntityBox from '../../widget/EntityBox';
import StatusBox from '../../widget/StatusBox';

export default React.memo(function Dashboard(){

    const state = useUsersState();
    const dispatch = useUsersDispatch();

    const { twin_info, entity_info_list ,policy_info_list,socket_status} = state;

    //console.log(state);
    const getEntityInfo = useMemo(()  =>{
        let entity_counts = entity_info_list.length;
        let enable_entity_counts = entity_info_list.filter(entity => entity.enable).length;

        return enable_entity_counts//+"/"+entity_counts
    },[entity_info_list]);


    return (
        <div className='dashboard'>
            <h1 >Dash Board</h1>
            
            <div className='dashboard_wrap'>
                {policy_info_list?.map(policy=>{
                    console.log(policy);
                    return  <StatusBox status={{title:policy.title,content:policy.enable?'실행중':'대기중',style:{color:policy.enable?'green':'grey','align-items':'center','justify-items':'center'}}}/>
                })}
                
                <StatusBox status={{title:"객체 활성화 수",content:getEntityInfo,style:{color:getEntityInfo>0?'green':'grey','align-items':'center','justify-items':'center'}}}/>
                <StatusBox status={{title:"트윈 서버 연결상태",content:socket_status,style:{color:socket_status==='disconnect'?'red':'green'}}}/>
            </div>
            
            <h3>Enable Entity Infos</h3>
            <div className='dashboard_top_wrap'>
                {entity_info_list?.filter(entity=>entity.enable).map(entity=>{
                    return <EntityBox entity={entity}/>
                })}
               
            </div>
            
         
           
           
        </div>
    )
});