import React, { useEffect,useState } from 'react';
//import { useUsersState, useUsersDispatch, getEntity } from '../../../UsersContext';
import {useInterval} from '../../../utils'
import ReactJson from 'react-json-view'
import useAsync from '../../../useAsync'
import {getEntity} from '../../../api'

function DashboardJsonEntityView({ id ,interval =3000 }) {
  
  const [state, refetch] = useAsync(()=>getEntity(id), [id]);
  const { loading, data, error } = state; // state.data 를 users 키워드로 조회

  useInterval(()=>{
    refetch();
  },interval)

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>Load Fail Entity ID : {id}</div>;
  if (!data) return <div>Entity Info empty : {id}</div>;
  return (
    <ReactJson 
    theme="monokai" //solarized
    src={data} 
    name={id} 
    indentWidth={4}
    iconStyle={"square"} // "circle", triangle" or "square".
    collapsed={false} // 접기
    /> 
  );
}

export default React.memo(DashboardJsonEntityView);