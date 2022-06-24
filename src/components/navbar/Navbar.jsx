import React from 'react'
import './navbar.scss'
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { NavLink  } from 'react-router-dom';

export default function navbar(){
    return (
    <div className='navbar'>
        <div className='navbarWrapper'>
            <div className='navbarMenu'>
                <h3 className='navbarTitle'>Menu</h3>
                <ul className="navbarList">
                    <NavLink  to="/" className={({isActive})=>
                       isActive?"navbarListItemActive":"navbarListItem"
                    }>
                        <li >
                            <HomeWorkIcon className='navbarIcon'/> 대시보드
                        </li>
                    </NavLink >
                    <NavLink  to="/policyManage" className={({isActive})=>
                       isActive?"navbarListItemActive":"navbarListItem"
                    }>
                        <li >
                            <TrendingUpIcon className='navbarIcon'/> 정책관리
                        </li>
                    </NavLink >
                   
                    <NavLink  to="/userList" className={({isActive})=>
                       isActive?"navbarListItemActive":"navbarListItem"
                    }>
                        <li >
                            <TrendingUpIcon className='navbarIcon'/> UserList
                        </li>
                    </NavLink >
                    <NavLink  to="/home" className={({isActive})=>
                       isActive?"navbarListItemActive":"navbarListItem"
                    }>
                        <li >
                            <MonetizationOnIcon className='navbarIcon'/>
                            Home
                        </li>
                    </NavLink >
                </ul>
            </div>

            {/* <div className='navbarMenu'>
                <h3 className='navbarTitle'>Dashboard</h3>
                <ul className="navbarList">
                <Link to="/users"  className="link">
                    <li className='navbarListItem'>
                        <HomeWorkIcon className='navbarIcon'/>
                        Users
                    </li>
                </Link>
                <Link to="/products" className="link">
                    <li className='navbarListItem'>
                        <TrendingUpIcon className='navbarIcon'/>
                        Products
                    </li>
                </Link >
                    <li className='navbarListItem'>
                        <MonetizationOnIcon className='navbarIcon'/>
                        Sales
                    </li>
                </ul>
            </div> */}
        </div>
    </div>
    )
}