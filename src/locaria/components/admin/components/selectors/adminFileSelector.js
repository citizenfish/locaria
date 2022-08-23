import React, {useEffect, useRef,useState} from 'react'
import {useDispatch, useSelector} from "react-redux"
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {setFiles} from "../../redux/slices/fileSelectSlice";
import {useCookies} from "react-cookie";
import StripedDataGrid from "../../../widgets/data/stripedDataGrid";
import Box from "@mui/material/Box";


export default function AdminFileSelector(props) {

    const [cookies, setCookies] = useCookies(['location'])
    const dispatch = useDispatch()
    const files = useSelector((state) => state.fileSelect.files);
    const fileSelected = useSelector((state) => state.fileSelect.currentSelected);
    const refresh = useSelector((state) => state.fileSelect.refresh);

    const fileActions = (params) => {
        let fileID = params.row.id
        let status = params.row.status
        return(
            <Grid container>
                <Grid item md={4}>
                    <Button variant="outlined"
                            color="success"
                            size="small"
                            onClick={() => {

                            }}>
                        {status === 'REGISTERED' ? 'Process' : 'Edit'}
                    </Button>
                </Grid>
                <Grid item md={4}>
                    <Button variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => {

                            }}>
                        Delete
                    </Button>
                </Grid>
            </Grid>
        )
    }

    const columns = [
        {field: 'id', headerName: 'ID', width: 50},
        {field : "name", headerName  : "File Name", width: 300},
        {field : "status", headerName:   "Status", width : 175},
        {field : "actions", headerName: 'Actions',renderCell: fileActions, width: 300},
        {field: 'last_updated', headerName: 'Last Updated', width: 200},
        {field: "attributes", hide: true}
    ]


    useEffect(() =>{

        window.websocket.registerQueue('getFiles', (json)=>{
            if(json.packet.files) {
                let rows=[]
                let id = 0
                let file_list = json.packet.files
                for(let i in file_list){
                    let file = file_list[i]
                    rows.push({
                        id: file.id,
                        attributes: {...file,...file.attributes},
                        name: file.attributes.name,
                        status: file.status,
                        last_updated: file.last_updated
                    })
                }
                dispatch(setFiles(rows))
            }
        })

    },[])

    useEffect(() => {
        window.websocket.send({
            queue: 'getFiles',
            api: "sapi",
            data: {
                method: "get_files",
                filter: {upload: true},
                id_token: cookies['id_token']
            }
        })
    },[refresh])

    return(
        <Box sx={{ height: '800px', width: 1, mt: '40px'}}>
            {files && fileSelected === '' &&
            <StripedDataGrid
                columns={columns}
                rows={files}
            />
            }
        </Box>
    )
}