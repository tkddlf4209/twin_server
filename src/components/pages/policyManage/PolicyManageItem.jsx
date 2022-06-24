import React, { useRef, useState } from 'react';
import './policyManageItem.scss'
import {Link} from 'react-router-dom';

import {Settings} from '@mui/icons-material';
import { fontWeight } from '@mui/system';

export default function PolicyManageItem({policy}){

    const {title,id,duration,relation_twins,enable} = policy;

    return (
        <div className='policyItem'>
            <div className='policyItemHeaderWrapper'>
                <div >
                    <span style={{fontWeight:600,fontSize:21}} > {id}.{title}</span>   
                </div>
                <div >
                    <Link to={`/policyManage/${id}`} state={{ policy: policy }}  style={{'text-decoration': 'none'}} >
                        <span className='plicyItemSettingButton outline'> 설정</span>
                    </Link>
                </div>
            </div>
            <div>
                <img src={require(id ===1?'../../../imgs/policy1.PNG':'../../../imgs/policy2.jpg')} className='policyItemImg' ></img>
                <div className={enable?'plicyItemRunButton stop':'plicyItemRunButton start'}>{enable?'STOP':'START'}</div>
                <div > durtaion : {duration}</div>
                <div > relation_twins : {JSON.stringify(relation_twins)}</div>
                <div > enable : {new String(enable)}</div>
            </div>
        </div>
    )
}