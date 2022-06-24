import React, { useRef, useState } from 'react';
import './userList.css'
import {DataGrid} from '@mui/x-data-grid'
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import {userRows} from '../../../datas/dummyData'
import {Link } from 'react-router-dom';

export default function UserList(){
    const [data ,setData] = useState(userRows);
    const handleDelete = (id) =>{
        setData(data.filter(item=>item.id !==id))
    }
    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "user", headerName: "User", width: 200 ,
            renderCell:(params)=>{
                return (
                    <div className='userListUser'>
                        <img className='userListImg' src={params.row.avatar} alt="" /> {params.row.lastName}
                    </div>
                )
            }},
        { field: "firstName", headerName: "First name", width: 130 },
        { field: "lastName", headerName: "Last name", width: 130 },
        {
          field: "age",
          headerName: "Age",
          type: "number",
          width: 90
        },
        {
          field: "fullName",
          headerName: "Full name",
          description: "This column has a value getter and is not sortable.",
          sortable: false,
          width: 160,
          valueGetter: (params) =>{
            return  params.row.firstName + " "+ params.row.lastName;
          }
        },
        { field: "city", headerName: "City", width: 100 },
        { field: "state", headerName: "State", width: 100 },
        { field: "action", headerName: "Action", width: 100 ,
        renderCell : (params) =>{
            return (
                <>
                    <Link to={'/user/'+params.row.id}>
                        <button className='userListEdit'>Edit</button>
                    </Link>
                  
                    <DeleteOutline className='userListDelete' onClick={()=>handleDelete(params.row.id)}/> 
                </>
            )
        } }
      ];
      
     
    return (
        <div className='userList'>
            <DataGrid
                rows={data}
                columns = {columns}
                pageSize = {10}
                checkboxSelection
                disableSelectionOnClick
                onSelectionModelChange={(t,c)=>{
                }}
            />
        </div>
    )
}