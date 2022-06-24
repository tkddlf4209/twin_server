import React, { useRef, useState } from 'react';
import './newUser.css'
import {Link} from 'react-router-dom';

export default function NewUser(){
    
    return (
        <div className='newUser'>
           <h1 className='newUserTitle'>New User</h1>
           <form className='newUserFrom'>
               <div className='newUserItem'>
                   <label>UserName</label>
                   <input type="text" placeholder='john'/>
               </div>
               <div className='newUserItem'>
                   <label>Full Name</label>
                   <input type="text" placeholder='1'/>
               </div>
               <div className='newUserItem'>
                   <label>Email</label>
                   <input type="text" placeholder='2'/>
               </div>
               <div className='newUserItem'>
                   <label>Password</label>
                   <input type="text" placeholder='3'/>
               </div>
               <div className='newUserItem'>
                   <label>Phone</label>
                   <input type="text" placeholder='4'/>
               </div>
               <div className='newUserItem'>
                   <label>Address</label>
                   <input type="text" placeholder='5'/>
               </div>
               <div className='newUserItem'>
                   <label>Gender</label>
                   <div className='newUserGender'>
                    <input type="radio" name="gender" id="male" value="male"/>
                    <label htmlFor="male">Male</label>
                    <input type="radio" name="gender" id="female" value="female"/>
                    <label htmlFor="female">Female</label>
                   </div>
               </div>
               <div className='newUserItem'>
                   <label>Active</label>
                   <select className='newUserSelect' name="active" id="active">
                       <option value="yes">Yes</option>
                       <option value="no">No</option>
                   </select>
               </div>
           </form>
           <button className='newUserButton'> create</button>
        </div>
    )
}