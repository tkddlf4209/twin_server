import React ,{useMemo} from 'react';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import styled from 'styled-components';
import {DataGrid} from '@mui/x-data-grid'

const props_colums = [
    // { field: "id", headerName: "Id", width: 300 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "prop_id", headerName: "PropId", width: 150 },
    { field: "value", headerName: "Value", flex: 1 }
    // { field: "data", headerName: "data",  flex: 1,// minWidth: 100
    // renderCell : (params) =>{
    //     return (
    //         <>
    //             <p >{JSON.stringify(params.row.data)}</p>
    //         </>
    //     )
    // }}
];

const Container = styled.div`                                                                                                                                                                                                                                                                                                                                                                                      
    margin : 8px;
    padding: 15px;
    width:600px;
    background-color: #202026;
    border-radius: 7px;
    cursor: pointer;
    -webkit-box-shadow: 2px 2px 5px 1px #202026;
    box-shadow: 1px 1px 3px 1px #202026;
`;

const Name = styled.span`
    font-size: 30px;
    font-weight: 600;
    margin-right:15px;
`;

const ID = styled.span`
    font-size: 10px;
    color: grey;
`

const ItemContainer = styled.div`
    margin: 4px 0;
    display: flex;
    align-items: center;
`

const Money = styled.span`
    font-size: 30px;
    font-weight: 600;
`;
const MoneyRate = styled.span`
    display: flex;
    align-items: center;
    margin-left: 20px;
`;

export default function EntityBox({entity}){

    console.log(entity.props);
    // const getRelationTwinIds = useMemo(()  =>{
    //     return ;
    // },[entity]);

    return ( 
        <Container>
                <Name>{entity.name}</Name>
                <ID>{entity.id} </ID>
                <DataGrid
                        rows={entity.props}
                        columns = {props_colums}
                        pageSize = {20}
                        autoHeight
                        hideFooter
                                                // checkboxSelection
                        onRowClick={(param)=>{
                            //nodeFocusTableHandler(param.row);
                            //console.log(JSON.stringify(param.row));
                        }}
                        onSelectionModelChange ={(ids)=>{
                           // setTwinSelectId(ids[0]);
                        }}
                    />
               
        </Container>
                
       
           
    )
}