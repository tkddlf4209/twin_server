import logo from './logo.svg';
import React, { useEffect, useState } from 'react';

import Header from './components/header/Header'
import Navbar from './components/navbar/Navbar'
import Init from './components/pages/init/Init'
import Dashboard from './components/pages/dashboard/Dashboard'
import EntityManage from './components/pages/entityManage/EntityManage'
import PolicyManage from './components/pages/policyManage/PolicyManage'
import TwinInfo from './components/pages/twinInfo/TwinInfo'
import WebSocket from './components/socket/WebSocket'
import { UsersProvider } from './UsersContext';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import useAsync from './useAsync'
import { checkInit } from './api'

//const PolicySetting = React.lazy(() => import('./components/pages/policyManage/PolicySetting'));

function App() {

  const [state, refetch] = useAsync(() => checkInit(), []);
  const { loading, data, error } = state; // state.data 를 users 키워드로 조회
  if (loading) return <div>로딩중..</div>;
  if (error) return <div>Load Fail Entity ID : </div>;
  if (!data) return <div>Entity Info empty : </div>;

  let twin_init = data.result; // 트윈 초기화 여부

  return (
    <UsersProvider>
      <WebSocket />
      <Router>
        {twin_init ?
          <div className="App">
            <Header />
            <div className='container'>
              <Navbar />
              <Routes>
                <Route exact path="/" element={<Dashboard />} />
                <Route exact path="/entityManage" element={<EntityManage />} />
                <Route exact path="/policyManage" element={<PolicyManage />} />
                <Route exact path="/twinInfo" element={<TwinInfo />} />
              </Routes>
            </div>
          </div> :
          <Routes>
            <Route exact path="/" element={<Init refetch={refetch} />} />
          </Routes>
        }
      </Router>
    </UsersProvider>

  );
}

export default App;
