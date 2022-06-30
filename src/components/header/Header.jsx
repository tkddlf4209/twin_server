import React , {useMemo} from 'react'
import './header.css'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsIcon from '@mui/icons-material/Settings';
import { useUsersState, useUsersDispatch, API , getEntity} from '../../UsersContext';

export default function Header(){

    const DEFAULT_NOTIFICATION = {
        image:
          "https://cutshort-data.s3.amazonaws.com/cloudfront/public/companies/5809d1d8af3059ed5b346ed1/logo-1615367026425-logo-v6.png",
        message: "Notification one.",
        detailPage: "/events",
        receivedTime: "12h ago"
      };
      
    const state = useUsersState();
    const dispatch = useUsersDispatch();
    const {event_logs} = state; 

    const getSingleTwinInfo = useMemo(()  =>{
        return event_logs.map(log =>{
            return {
                // image: logo,
                message: 'Kameshwaran S had shared a'
                // detailPage: '/',
            }
        });
        
    },[event_logs]);

    return(
        <div className='header'>
            <div className='headerWrapper'>
                <div className='headerLeft'>
                    <span className='logo'>디지털트윈 카탈로그 서버</span>
                </div>
                <div className='headerRight'>

                    <div className='headerIconContainer'>
                     
                    </div>
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
