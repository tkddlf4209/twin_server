import React, { useEffect,useState } from 'react';
import { useUsersState, useUsersDispatch, getTwin } from '../../../UsersContext';
import {useInterval} from '../../../utils'

import ReactJson from 'react-json-view'
function DashboardJsonTwinView({ id ,interval =3000}) {
  const state = useUsersState();
  const dispatch = useUsersDispatch();

  useEffect(()=>{
    getTwin(dispatch, id);
  },[id]);
  
  useInterval(()=>{
    getTwin(dispatch, id);
  },interval)

  const { data: twin, loading, error } = state.twin;

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>Load Fail Twin ID : {id}</div>;
  if (!twin) return <div>Twin Info empty : {id}</div>;
  return (
    <ReactJson 
    src={twin} 
    name={id} 
    indentWidth={2}
    iconStyle={"triangle"} // "circle", triangle" or "square".
    collapsed={false} // 접기
    />  
  );
}

export default React.memo(DashboardJsonTwinView);