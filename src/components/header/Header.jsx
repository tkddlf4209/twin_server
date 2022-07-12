import React , {useMemo} from 'react'
import './header.css'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsIcon from '@mui/icons-material/Settings';
import { useUsersState, useUsersDispatch} from '../../UsersContext';

export default function Header(){
    const state = useUsersState();
    const dispatch = useUsersDispatch();
    const {twin_info} = state; 

    return(
        <div className='header'>
            <div className='headerWrapper'>
                <div className='headerLeft'>
                    <span className='logo'>디지털트윈 서버</span>
                </div>
                <div className='headerRight'>

                    <div className='headerIconContainer'>
                     
                    </div>
                    {
                        /* <div className='headerIconContainer'>
                            <NotificationsNoneIcon />
                            <span className='headerIconBadge'>2</span>
                        </div>

                        <div className='headerIconContainer'>
                            <SettingsIcon />
                            <span className='headerIconBadge'>2</span>
                        </div> */
                    }
                    {twin_info?twin_info.name+' Login':""}
                   {   
                        /* <img className='headerAvatar' src='https://phinf.pstatic.net/contact/20210921_259/1632208752742E0WBm_PNG/bit_pump_app_logo.png?type=f130_130' alt=''/> */
                   }
                  
                </div>
            </div>
        </div>

    )
}
