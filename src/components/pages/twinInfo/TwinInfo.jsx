import React , {useState, useEffect,useMemo , useCallback,useRef}from 'react'
import { alpha, styled } from "@mui/material/styles";
import "./twinInfo.scss"
import {DataGrid} from '@mui/x-data-grid'
import TextField  from '@mui/material/TextField';
import { useUsersState, useUsersDispatch, API} from '../../../UsersContext';


const ValidationTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: 'white',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'white',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'white',
        },
        '&:hover fieldset': {
          borderColor: 'green',
        },
        '&.Mui-focused fieldset': {
            borderLeftWidth: 6,
            padding: "4px !important" // override inline-style
        },
      },
  });

  
export default React.memo(function TwinInfo(){

    const state = useUsersState();
    const dispatch = useUsersDispatch();

    const {twin_info , socket_status } = state;

    console.log(twin_info);
    //console.log(state);

    const InputText = (props) =>{
        return (<ValidationTextField
        
            label={props.label}
            // required
            variant="outlined"
            defaultValue={props.value}
            id="validation-outlined-input"
            inputProps={
                { readOnly: true, }
            }
            margin="dense" 
            sx={{
                input: {
                  color: props.color?props.color:"white",
                },
                label:{
                    color:"white"
                }
              }}
        />)


    }

    const getTwinTypeName = (type)=>{
        switch(type){
            case 1:
                return "제조"
                case 2:
                    return "에너지"
                    default:
                        return "Undfined"
        }
    }
 
    return (
        <div className='twinInfo'>
            <h1 >Twin Info</h1>
            <div className='twinInfo_wrap'>
                <InputText label={'Twin ID'} value={twin_info.id} ></InputText>
                <InputText label={'Twin Name'} value={twin_info.name}></InputText>
                <InputText label={'Twin Type'} value={getTwinTypeName(twin_info.type)}></InputText>
                <InputText label={'Twin Server URL'} value={twin_info.server_url}></InputText>
                <InputText label={'Twin Server Status'} value={socket_status} color={socket_status==='disconnect'?'red':'green'}></InputText>
            </div>
        </div>
    )
});