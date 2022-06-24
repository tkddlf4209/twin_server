import React, { useEffect,useState } from 'react';
import { useUsersState, useUsersDispatch, getEntity } from '../../../UsersContext';
import {useInterval} from '../../../utils'
import ReactJson from 'react-json-view'

function DashboardJsonEntityView({ id ,interval =3000 }) {
  const state = useUsersState();
  const dispatch = useUsersDispatch();

  useEffect(()=>{
    getEntity(dispatch, id);
  },[id]);

  useInterval(()=>{
    getEntity(dispatch, id);
  },interval)

  const { data: entity, loading, error } = state.entity;

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>Load Fail Entity ID : {id}</div>;
  if (!entity) return <div>Entity Info empty : {id}</div>;
  return (
    <ReactJson 
    src={entity} 
    name={id} 
    indentWidth={2}
    iconStyle={"triangle"} // "circle", triangle" or "square".
    collapsed={false} // 접기
    /> 
  );
}

export default React.memo(DashboardJsonEntityView);