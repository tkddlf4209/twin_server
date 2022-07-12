import React , {useState, useEffect,useMemo , useCallback,useRef}from 'react'
import { useUsersState, useUsersDispatch, API} from '../../../UsersContext';

import useAsync from '../../../useAsync'
import './init.scss';
import { twinInit } from '../../../api'


export default function Init({refetch}){

    const [twinName , setTwinName] = useState("");
    const [twinType , setTwinType] = useState("1");
    const handleSelect = (e) => {
        setTwinType(e.target.value);
    };
    const handleInput = (e) => {
        setTwinName(e.target.value)
    };

    const handleInit = async () =>{
        
        try{
            let data = await twinInit({
                twin_name : twinName,
                twin_type : twinType
            });

            refetch();
        }catch(e){
            console.log(e);
        }
    }


    return (
        <div className='InitContainer'>
                <h1 className='newUserTitle'>트윈 초기화</h1>
                <label className='InitLabel'>트윈 이름</label>
                <input className='InitInput'  type="text" placeholder='twin_name' onChange={handleInput} value={twinName}/>
                
                <label className='InitLabel'>트윈 타입</label>
                <select className='InitSelect' onChange={handleSelect} value={twinType}>
                    <option value="1" className='InitPotionColor'>제조</option>
                    <option value="2" className='InitPotionColor'>에너지</option>
                </select>

                <div onClick={(e)=>{
                  handleInit()
                }} className='InitButton outline'>트윈 초기화</div>
        </div>

    );
}