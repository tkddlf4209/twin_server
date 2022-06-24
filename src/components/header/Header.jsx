import React from 'react'
import './header.css'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsIcon from '@mui/icons-material/Settings';

export default function Header(){
    return(
        <div className='header'>
            <div className='headerWrapper'>
                <div className='headerLeft'>
                    <span className='logo'>디지털트윈 카탈로그 서버</span>
                </div>
                <div className='headerRight'>
                    <div className='headerIconContainer'>
                        <NotificationsNoneIcon />
                        <span className='headerIconBadge'>2</span>
                    </div>

                    <div className='headerIconContainer'>
                        <SettingsIcon />
                        <span className='headerIconBadge'>2</span>
                    </div>
                   <img className='headerAvatar' src='https://phinf.pstatic.net/contact/20210921_259/1632208752742E0WBm_PNG/bit_pump_app_logo.png?type=f130_130' alt=''/>
                </div>
            </div>
        </div>

    )
}
