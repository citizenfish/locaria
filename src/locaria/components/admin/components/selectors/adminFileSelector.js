import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {setFiles,setRefresh,setFile} from "../../redux/slices/fileSelectSlice";
import {useCookies} from "react-cookie";
import StripedDataGrid from "../../../widgets/data/stripedDataGrid";
import AdminDialogConfirm from "../../dialogues/adminDialogueConfirm";
import AdminFileDetails from "../../pages/adminFileDetails";
import Box from "@mui/material/Box";


export default function AdminFileSelector(props) {

    const [cookies, setCookies] = useCookies(['location'])
    const dispatch = useDispatch()
    const files = useSelector((state) => state.fileSelect.files)
    const fileSelected = useSelector((state) => state.fileSelect.currentSelected)
    const refresh = useSelector((state) => state.fileSelect.refresh)
    const [dialogProps, setDialogueProps] = React.useState({open : false});

    const fileActions = (params) => {
        let fileID = params.row.id
        let status = params.row.status
        return(
            <Grid container spacing={4}>
                <Grid item md={4}>
                    <Button variant="outlined"
                            color="success"
                            size="small"
                            onClick={() => {
                                dispatch(setFile(params.row))
                            }}>
                        {status === 'REGISTERED' ? 'Process' : 'Configure'}
                    </Button>
                </Grid>
                <Grid item md={4}>
                    <Button variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => {
                                setDialogueProps({
                                    open : true,
                                    title: 'Delete File',
                                    text:`Are you sure you want to delete file ${fileID}?`,
                                    dismissText: 'Cancel',
                                    confirmText: 'Delete',
                                    confirmFunction: deleteFile,
                                    confirmParams: fileID,
                                    openSet : setDialogueProps
                                })

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

    const deleteFile = (fileID) => {
        window.websocket.send({
            queue: 'fileAPI',
            api: "sapi",
            data: {
                method: "delete_file",
                id : fileID,
                id_token: cookies['id_token']
            }
        })
    }

    useEffect(() => {
        window.websocket.registerQueue('fileStatus', (json)=>{
            dispatch(setRefresh())
        })

        window.websocket.registerQueue('fileAPI', (json)=> {
            dispatch(setRefresh())
        })
    },[])

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
        <div>
            <AdminDialogConfirm
                p = {dialogProps}
            />

            <Box sx={{ height: '800px', width: 1, mt: '40px'}}>
                {files && fileSelected.id === undefined &&
                <StripedDataGrid
                    columns={columns}
                    rows={files}
                    initialState={{
                        sorting: { sortModel: [{ field: "id", sort: "desc" }] }
                    }}
                />
                }
                {fileSelected.id !== undefined && <AdminFileDetails/>}
            </Box>
        </div>
    )
}