import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"
import {setApi,setApis, setFilesConfigured} from "../../redux/slices/apiSelectSlice"
import {useCookies} from "react-cookie"
//import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import StripedDataGrid from "../../../widgets/data/stripeDataGrid";
import ThelistEventsApiEditor from "../forms/thelistEventsApiEditor";

export default function ApiSelector() {

    const apis = useSelector((state) => state.apiSelect.apis)
    const apiSelected = useSelector((state) => state.apiSelect.currentSelected)
    const filesConfigured = useSelector((state) => state.apiSelect.filesConfigured)
    const dispatch = useDispatch()
    const [cookies, setCookies] = useCookies(['location'])

    const apiActions = (params) => {
        return (
            <Grid container>
                <Grid item md={4}>
                    <Button variant="outlined"
                            color="success"
                            size="small"
                            onClick={() => {
                                console.log(params)
                                dispatch(setApi(params.row.custom_loader))
                            }}>
                        Set up
                    </Button>
                </Grid>
                <Grid item md={4}>
                    <Button variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => {
                            }}>
                        Disable
                    </Button>
                </Grid>
                <Grid item md={4}>
                    <Button variant="outlined"
                            color="warning"
                            size="small"
                            onClick={() => {
                            }}>
                        Run Once
                    </Button>
                </Grid>
            </Grid>
        )
    }

    const apiConfigured = (params) =>{

        console.log(filesConfigured)

        if(filesConfigured[params.row.custom_loader]){
            return (
                <Typography variant = "body2">
                    {filesConfigured[params.row.custom_loader].status}
                </Typography>
            )
        } else {
            return(
                <Typography>
                    Not installed
                </Typography>
            )
        }
    }

    const columns = [
        {field: 'name', headerName: 'API', width: 200},
        {field: 'description', headerName: 'Description', width: 400},
        {field: 'enabled', headerName: 'Status', width:200, renderCell:apiConfigured},
        {field: 'actions', headerName: 'Actions', width:300, renderCell: apiActions},
        {field: 'component', hide: true},
        {field: 'custom_loader', hide: true}
    ]



    useEffect(() => {
        /** Get a list of configured APIS**/

        window.websocket.registerQueue('getAPIs', (json) => {
            if (json.packet.parameters.installed_apis){
                let rows = []
                let id = 0
                let configs = json.packet.parameters.installed_apis
                delete configs.last_updated
                for (let a in configs){
                    rows.push({
                        id: id++,
                        name: a,
                        description: configs[a].description,
                        //TODO check enabled status from files table
                        enabled: false,
                        component: configs[a].component,
                        custom_loader: configs[a].custom_loader
                    })
                }
                dispatch(setApis(rows))
            }
        })

        window.websocket.send({
            queue: "getAPIs",
            api: "sapi",
            data: {
                method: "get_parameters",
                parameter_name: "installed_apis",
                id_token: cookies['id_token']
            }
        })

        /** Get a list of files that are running APIS **/

        window.websocket.registerQueue('getAPIFiles', (json) => {
            if(json.packet.files.length > 0){
                let files = {}
                let file_list =  json.packet.files
                for(let f in file_list){
                    files[file_list[f].attributes.custom_loader] = file_list[f]
                }
                dispatch(setFilesConfigured(files))
            }

        })

        window.websocket.send({
            queue: "getAPIFiles",
            api: "sapi",
            data: {
                method: "get_files",
                filter: {api: true, auto_update: true},
                id_token: cookies['id_token']
            }
        })
    },[])

    return (
        <Box sx={{ height: '800px', width: 1, mt: '40px'}}>
            {apis && apiSelected === '' &&
            <StripedDataGrid
                      columns={columns}
                      rows={apis}
            />
            }
            {
                apiSelected === 'thelist_events' &&

                    <ThelistEventsApiEditor/>

            }
        </Box>
    )
}