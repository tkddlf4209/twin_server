import React, { useEffect,useState } from 'react';
import {useInterval} from '../../../utils'
import useAsync from '../../../useAsync'
import {getTwin} from '../../../api'

import ReactJson from 'react-json-view'
function DashboardJsonTwinView({ id ,interval =3000}) {

  const [state, refetch] = useAsync(()=>getTwin(id), [id]);
  const { loading, data, error } = state; // state.data 를 users 키워드로 조회

  useInterval(()=>{
    refetch();
  },interval)

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>Load Fail Twin ID : {id}</div>;
  if (!data) return <div>Twin Info empty : {id}</div>;
  return (
    <ReactJson 
    theme="solarized" //monokai
    src={data} 
    name={id} 
    indentWidth={2}
    iconStyle={"triangle"} // "circle", triangle" or "square".
    collapsed={false} // 접기
    />  
  );
}

export default React.memo(DashboardJsonTwinView);