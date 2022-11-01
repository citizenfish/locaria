import React, {useEffect,useState} from 'react'
import StripedDataGrid from "../../../widgets/data/stripedDataGrid";
import {useCookies} from "react-cookie";
import {setRefresh} from "../../redux/slices/fileSelectSlice";
import {useDispatch, useSelector} from "react-redux"
import AdminDialogConfirm from "../../dialogues/adminDialogueConfirm";
import {Button,Box} from "@mui/material";


export default function AdminDownloadSelector(props) {

    const [cookies, setCookies] = useCookies(['location'])
    const refresh = useSelector((state) => state.fileSelect.refresh)
    const [downloads,setDownloads] = useState([])
    const [dialogProps, setDialogueProps] = React.useState({open : false});
    const dispatch = useDispatch()

    const downloadActions = (params) =>{
        return(<Button>Download</Button>)
    }
    const columns = [
        {field: 'id', headerName: 'ID', width: 50},
        {field : "name", headerName  : "File Name", width: 300},
        {field : "status", headerName:   "Status", width : 200},
        {field : "actions", headerName: 'Actions',renderCell: downloadActions, width: 300},
        {field: 'last_updated', headerName: 'Last Updated', width: 200},
        {field: "attributes", hide: true}
    ]
    useEffect(() => {
        window.websocket.registerQueue('fileStatus', (json)=>{
            dispatch(setRefresh())
        })

    },[])


    useEffect(() =>{

        window.websocket.registerQueue('getDownloads', (json)=>{
            if(json.packet.files) {
                let rows=[]
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

                setDownloads(rows)
            }
        })

    },[])

    useEffect(() => {

        window.websocket.send({
            queue: 'getDownloads',
            api: "sapi",
            data: {
                method: "get_files",
                filter: {download: true},
                id_token: cookies['id_token']
            }
        })

    },[refresh])

    return(<div>
        <AdminDialogConfirm
            p = {dialogProps}
        />

        <Box sx={{ height: '800px', width: 1, mt: '40px'}}>
            {downloads &&
            <StripedDataGrid
                columns={columns}
                rows={downloads}
                initialState={{
                    sorting: { sortModel: [{ field: "id", sort: "desc" }] }
                }}
            />
            }
        </Box>
    </div>)
}