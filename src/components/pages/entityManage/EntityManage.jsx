import React , {useState, useEffect,useMemo , useCallback,useRef}from 'react'
//import { ForceGraph2D  } from 'react-force-graph';
import "./entityManage.scss"
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

export default React.memo(function EntityManage(){

    const state = useUsersState();
    const dispatch = useUsersDispatch();

    const {entity_info_list , simulation_list} = state;
    const [entityId , setEntityId] = useState(null)

    console.log(simulation_list);
    //console.log(state);
    const getData = useMemo(()  =>{
        
        let entity = null;
        if(entityId){
            entity =  entity_info_list?.find(entity=> entity.id === entityId);
        }

        if(entity){
            return entity
        }else{
            return {}
        }

        
    },[entity_info_list,entityId]);


    const getSimulationData = useMemo(()  =>{
        return simulation_list.map(simulation=>{
            let entity = entity_info_list.find(entity => entity.entity_id === simulation.entity_id);
            let targetProp = entity.props.find(prop => prop.prop_id === simulation.prop_id);

            return {...simulation,current_value : targetProp.value,min :targetProp.min,max: targetProp.max}

        })
    },[entity_info_list,simulation_list]);


    
    const entity_colums = [
        { field: "enable", headerName: "객체 활성화", width: 150   ,
        renderCell : (params) =>{
            return (
                <>
                    <Switch  checked={params.row.enable}  onClick={()=>API.updateEntity({
                        data :{...params.row,enable:!params.row.enable}
                    })}/> 
                </>
            )
        }},
        { field: "id", headerName: "ID", width: 300 },
        { field: "name", headerName: "객체명", width: 150 },
        { field: "entity_id", headerName: "객체 ID", width: 150  },
        { field: "type", headerName: "타입", width: 150  },
        { field: "props", headerName: "프로퍼티 수", flex: 1  ,
        renderCell : (params) =>{
            return (
                <>
                    {params.row.props.length}
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


    const simulation_colums = [
        { field: "enable", headerName: "활성화", width: 100   ,
        renderCell : (params) =>{
            return (
                <>
                    <Switch  checked={params.row.enable}  
                    onClick={()=>{

                        // 같은 객체를 시뮬레이션하는 시뮬레이터가 동작중이면 끄고 시작해야함
                        let enableSimulationSameEntityId = simulation_list.find(simulation => simulation.id !== params.row.id && simulation.entity_id === params.row.entity_id && simulation.enable);
                        let changeEnable = !params.row.enable;

                        if(changeEnable){ 
                            if(enableSimulationSameEntityId){
                                alert("동일한 객체를 참조하는 시뮬레이션이 실행중입니다.\n비활성화 후 다시 시도해주세요")
                            }else{
                                API.updateSimulation({
                                    data :{...params.row,enable:changeEnable}
                                })
                            }
                        }else{
                            // 끌때는 걍 끄면댐
                            API.updateSimulation({
                                data :{...params.row,enable:changeEnable}
                            })
                        }
                       
                    }}
                    /> 
                </>
            )
        }},
        { field: "title", headerName: "시뮬레이션 명", width: 200 },
        { field: "entity_id", headerName: "객체 아이디", width: 150 },
        { field: "prop_id", headerName: "프로퍼티 아이디", width: 150  },
        { field: "min", headerName: "최소 값", width: 100  },
        { field: "max", headerName: "최대 값", width: 100  },
        { field: "current_value", headerName: "현재 값", width: 100 },
        { field: "target_value", headerName: "목표 값", width: 150 ,editable: true,type: 'number',
        renderCell : (param) =>{
            return (
                <>
                    <p>{param.row.target_value}</p>
                </>
            )
        }} 
    ];

    const handleCellEditCommit = React.useCallback(
        ({ id, field, value }) => {
          if (field === 'target_value') {
            let simulation = simulation_list.find(simulation=> simulation.id === id);
            let entity = entity_info_list.find(entity => entity.id === simulation.entity_id); // 
            if(value !== ''){
                API.updateSimulation({
                    data :{...simulation,target_value:value}
                })
            }
          }
        },
        [simulation_list],
     );

    

    return (
        <div className='entityManage'>
            <h1 >Entity Manage</h1>
            <div className='entityManage_wrap'>
                <div className='entityManage_wrap_left'>
                    <DataGrid
                            rows={entity_info_list?entity_info_list:[]}
                            columns = {entity_colums}
                            pageSize = {20}
                            autoHeight               
                            onRowClick={(param)=>{
                                setEntityId(param.row.id)
                                //nodeFocusTableHandler(param.row);
                                //console.log(JSON.stringify(param.row));
                            }}
                            onSelectionModelChange ={(ids)=>{
                            // setTwinSelectId(ids[0]);
                            }}

                        />
                        <h3>Simulation</h3>

                    <DataGrid
                            rows={getSimulationData}
                            columns = {simulation_colums}
                            pageSize = {20}
                            autoHeight               
                            onRowClick={(param)=>{
                                //setEntityId(param.row.id)
                                //nodeFocusTableHandler(param.row);
                                //console.log(JSON.stringify(param.row));
                            }}
   
                            onCellEditCommit={handleCellEditCommit}
                        />
                
                </div>
                <ReactJson 
                    theme="monokai" //solarized
                    src={getData} 
                    name={"entity"} 
                    indentWidth={4}
                    style={{width:500}}
                    
                    onEdit={async (e)=>{
                        let result = await API.editEntity(e.updated_src);
                        console.log(result);
                    }}
                    iconStyle={"square"} 
                    collapsed={false} />
               
            </div>
           
        </div>
    )
});