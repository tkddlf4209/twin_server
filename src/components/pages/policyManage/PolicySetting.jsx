import React, { useRef, useState , useMemo,useEffect } from 'react';
import './policySetting.scss'
import {Link,useParams,useLocation} from 'react-router-dom';

import {DataGrid} from '@mui/x-data-grid'
import { useUsersState, useUsersDispatch, getAllInfos} from '../../../UsersContext';
import {PermIdentity,CalendarToday,PhoneIphone,MailOutline,LocationOn,Publish} from '@mui/icons-material';

let init =false;
export default function PolicySetting(){

    //const {plicyId} = useParams();
    const state = useUsersState();
    const dispatch = useUsersDispatch();

    useEffect(()=>{
        getAllInfos(dispatch);
    },[]);
    
    const { data: allInfos, loading, error } = state.allInfos;

    const location = useLocation();
    const initPolicy = location.state?.policy;

    const [policy, setPolicy] = useState(initPolicy);
    const [relationTwins, setRelationTwins] = useState(initPolicy.relation_twins);

    const [selectTwinProps, setSelectTwinProps] = useState([]);
    //const [twinInfos, setTwinInfos] = useState(null);
    const [entityInfos, setEntityInfos] = useState(null);
    const [props, setProps] = useState( [
        {id : 0, name : "미세먼지", value :10 , target_value : 20},
        {id : 1, name : "이상화탄소", value :20 , target_value : 30},
    ]);

    let { twin_infos , entity_infos } = (allInfos?allInfos:{twin_infos:{},entity_infos:{}});

    // if(allInfos){
    //     console.log('tt',twin_infos);
    //     if(init===false){
    //         setTwinInfos(twin_infos);
    //         setEntityInfos(entity_infos);
    //         init =true;
    //     }
    // }

    const getTwinList = useMemo(()  =>{
        var list = [];

        if(twin_infos){
            for (const [id, twin] of Object.entries(twin_infos)) {
                list.push(twin);   
            }
        }
       
        return list;

    },[]);


    const twin_select_columns = [
        { field: "id", headerName: "Id", width: 150 , hide:true},
        { field: "name", headerName: "name", width: 150 },
        { field: "status", headerName: "Status", width: 100,
        renderCell : (params) =>{
            return (
                <>
                    <p style={params.row.status==="connect"?{color:"green"}:{color:"red"}}>{params.row.status}</p>
                </>
            )
        }},
        { field: "tag", headerName: "tag", width: 150 }
    ];
    
    const policy_target_select_columns = [
        { field: "id", headerName: "Id", width: 150 , hide:true},
        { field: "name", headerName: "name", width: 150 },
        { field: "value", headerName: "value", width: 100,editable: true,type: 'number',
        renderCell : (param) =>{
            var selected = selectTwinProps.some((id)=>param.row.id===id);
            return (
                <>
                    <p >{selected?param.row.value:''}</p>
                </>
            )
        }},
        { field: "target_value", headerName: "target_value", width: 150 ,editable: true,type: 'number',
        renderCell : (param) =>{
            var selected = selectTwinProps.some((id)=>param.row.id===id);
            return (
                <>
                    <p >{selected?param.row.target_value:''}</p>
                </>
            )
        }}
    ];
    

    return (
        <div className='policySetting'>

            <div className='policySettingWrap center'>
                <h1 style={{flex:1}} >Policy Setting</h1>  <p className='policySettingSaveButton outline'>SAVE</p>
            </div>
            <div className='policySettingTop'>
                <div className='policySettingTopItem'>
                    <label>정책명</label>
                    <input type="text" name="title" placeholder='ex)계절관리제' value={policy.title} onChange={(e)=>{
                        setPolicy({...policy,title:e.target.value})
                    }} className='policySettingInput'></input>
                </div>
                <div className='policySettingTopItem'>
                    <label>동작주기</label>
                    <input type="text" placeholder='duration' value={policy.duration} onChange={(e)=>{
                        setPolicy({...policy,duration:e.target.value})
                    }} className='policySettingInput'></input>
                </div>
            </div>

            <div className='policySettingWrap'>
                <div className='policySettingLeft'>
                   Select Relation Twins
                   <DataGrid
                        rows={getTwinList}
                        columns = {twin_select_columns}
                        pageSize = {20}
                        checkboxSelection
                        hideFooter
                        disableSelectionOnClick
                        selectionModel={relationTwins}
                        onRowClick={(param)=>{
                            //nodeFocusTableHandler(param.row);
                            //console.log(JSON.stringify(param.row));
                        }}
                        onSelectionModelChange ={(ids)=>{
                            setRelationTwins(ids)
                            // setTwinSelectId(ids[0]);
                        }}
                    />

                </div>
                <div className='policySettingRight'>
                    Target Value Setting
                    <DataGrid
                        rows={props}
                        columns = {policy_target_select_columns}
                        // pageSize = {20}
                        pagination={false}
                        checkboxSelection
                        hideFooter
                        disableSelectionOnClick
                        selectionModel={selectTwinProps}
                        onRowClick={(param)=>{
                            //nodeFocusTableHandler(param.row);
                            //console.log(JSON.stringify(param.row));
                        }}
                        isCellEditable={(param) => {
                            // 체크 박스가 선택된 프로퍼티만 수정가능
                            return selectTwinProps.some((id)=>param.row.id===id);
                        }}
                        onSelectionModelChange ={(ids)=>{
                            setSelectTwinProps(ids)
                        }}
                    />
                   
                </div>
            </div>

        </div>
    )
}