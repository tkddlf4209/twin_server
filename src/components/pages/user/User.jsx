import React, { useRef, useState } from 'react';
import './user.css'
import {Link,useParams, useLocation} from 'react-router-dom';
import qs from 'qs';

import {PermIdentity,CalendarToday,PhoneIphone,MailOutline,LocationOn,Publish} from '@mui/icons-material';

export default function User(){
    const { userId } = useParams();
    const {search} =useLocation();

    const query = qs.parse(search, {
        ignoreQueryPrefix: true
      });

    console.log(userId,query);
    return (
        <div className='user'>
            <div className='userTitleContainer'>
                <h1 className='userTitle'>Edit User</h1>
                <Link to="/newUser">
                    <button className='userAddButton'>Create</button>
                </Link>
            </div>
            <div className='userContainer'>
                <div className='userShow'>
                    <div className='userShowTop'>
                        <img className='userShowImg' alt='' src='https://phinf.pstatic.net/contact/20210921_259/1632208752742E0WBm_PNG/bit_pump_app_logo.png?type=f130_130'/>
                        <div className='userShowTopTitle'>
                            <span className='userShowUsername'> Sangil Im</span>
                            <span className='userShowUserTitle'> Developer</span>
                        </div>
                    </div>
                    <div className='userShowBottom'>
                        <span className='userShowTitle'> Account Details</span>
                        <div className='userShowInfo'>
                            <PermIdentity className='userShowIcon'/>
                            <span className='userShowInfoTitle'>sangil</span>
                        </div>
                        <div className='userShowInfo'>
                            <CalendarToday className='userShowIcon'/>
                            <span className='userShowInfoTitle'>2022.06.08</span>
                        </div>
                        <span className='userShowTitle'> Contact Details</span>
                        <div className='userShowInfo'>
                            <PhoneIphone className='userShowIcon'/>
                            <span className='userShowInfoTitle'>test</span>
                        </div>
                        <div className='userShowInfo'>
                            <MailOutline className='userShowIcon'/>
                            <span className='userShowInfoTitle'>tkddlf4209@naver.com</span>
                        </div>
                        <div className='userShowInfo'>
                            <LocationOn className='userShowIcon'/>
                            <span className='userShowInfoTitle'>Deajon</span>
                        </div>
                    </div>
                </div>
                <div className='userUpdate'>
                    <span className='userUpdateTitle'>Edit</span>
                    <form className='userUpdateForm'>
                        <div className='userUpdateleft'>
                            <div className='userUpdateItem'>
                                <label>Username</label>
                                <input type="text" placeholder='tteeest' className='userUpdateInput'></input>
                            </div>
                            <div className='userUpdateItem'>
                                <label>Full Name</label>
                                <input type="text" placeholder='sangil im' className='userUpdateInput'></input>
                            </div>
                            <div className='userUpdateItem'>
                                <label>Email</label>
                                <input type="text" placeholder='sangil@naver' className='userUpdateInput'></input>
                            </div>
                            <div className='userUpdateItem'>
                                <label>Phone</label>
                                <input type="text" placeholder='1111' className='userUpdateInput'></input>
                            </div>
                            <div className='userUpdateItem'>
                                <label>Address</label>
                                <input type="text" placeholder='1111' className='userUpdateInput'></input>
                            </div>
                            
                        </div>
                        <div className='userUpdateRight'>
                            <div className='userUpdateUpload'>
                                <img src='https://phinf.pstatic.net/contact/20210921_259/1632208752742E0WBm_PNG/bit_pump_app_logo.png?type=f130_130' alt="" className='userUpdateImg'></img>
                                <label htmlFor='file'>
                                    <Publish/>
                                </label>
                                <input type="file" id="file" style={{display:'none'}}/>
                            </div>
                            <button className='userUpdateButton'>Update</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}