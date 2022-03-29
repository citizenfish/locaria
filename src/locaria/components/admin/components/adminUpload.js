import React, {useState,useEffect} from "react"
import {DataGrid} from '@mui/x-data-grid'
import {useCookies} from "react-cookie";
import LinearProgress from '@mui/material/LinearProgress';
import AdminFileUploader from './adminFileUploader'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import AdminFileDetails from "./adminFileDetails";
import AdminDataMapper from "./adminDataMapper";
import AdminPlanningLoader from "./adminPlanningLoader";
import AdminFloodMonitoringLoader from "./adminFloodMonitoringLoader";
import AdminCrimeLoader from "./adminCrimeLoader.js";
import AdminBoundaryLoader from "./adminBoundaryLoader";
import AdminEventsLoader from "./adminEventsLoader";

//Details of file we are going to map
let fileDetailsData = {}

//How often we poll for file updates,default is 30 seconds
let defaultRefreshInterval = 31000

export default function AdminUpload(props) {

    const [cookies, setCookies] = useCookies(['location'])
    // hook for file listing display
    const [tableData,setTableData] = useState([])
    // hook set when we are fetching details of files, used by AdminFileUploader to force a re-render after upload
    const [dataFetching, setDataFetching] = useState(true)
    // hook used to open/close the file details control
    const [open, setOpen] = React.useState(false);
    //hook used to trigger a refresh from a timer to update the file listing from database
    const [time, setTime] = useState(Date.now());
    //hook used to display the data mapping component
    const [mapFileDetails,setMapFileDetails] = useState(null)
    //hook used to display planning loader component
    const [planningLoader, setPlanningLoader] = useState(false)

    useEffect(() => {
        //This hook manages the refresh of the files display every X seconds
        const interval = setInterval(() => {
                setTime(Date.now())
        }, props.refreshInterval || defaultRefreshInterval);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const showFileDetails = (params) => {
        //Create the data structure to display a file's details
        fileDetailsData = params
        setOpen(true)
    };

    const viewButton = (params) => {
        //The View file details button shown in the file listing
        return(

            <Button
                variant="contained"
                color={params.value.status== 'FARGATE_PROCESSED'? "primary" :
                        params.value.status === 'ERROR' ? "error" :
                           (params.value.status === 'REGISTERED' || params.value.status === 'FARGATE_PROCESSING') ? 'secondary'
                               :"success"}
                size="small"
                onClick ={() => showFileDetails(params.value)}
            >
                {params.value.status === 'FARGATE_PROCESSED'? "IMPORT" : "DETAILS"}
            </Button>

        )
    }

    //The column layout for file listing
    const columns = [
        {field: 'id', headerName: 'ID', width: 50},
        {field : "attributes", headerName: 'Details',renderCell: viewButton, disableClickEventBubbling: true, width: 150},
        {field : "name", headerName  : "File Name", width: 300},
        {field : "status", headerName:   "Status", width : 200}

    ]

    //The column layout for file details listing
    const fileColumns = [
        {field: 'id', headerName: 'Message ID', width: 50},
        {field: 'timestamp', headerName:'Time Stamp', width: 200},
        {field: 'message', headerName:'Message', width: 600}
    ]
    useEffect(() =>{
        //Register the initial ws queue for getting details of files, only fired once on render
        window.websocket.registerQueue("getFiles", function(json){
            let files = []
            for(let f in json.packet.files) {
                let file = json.packet.files[f]
                files.push({id: file.id, attributes : {...file,...file.attributes}, name : file.attributes.name, status : file.status})
            }
            setTableData(files)
        })
    },[])

    useEffect( () => {
        //Fetch file details every 30 seconds based upon the time hook
        //Don't fetch if we are looking at a file's details
        if(!open && mapFileDetails === null) {
            window.websocket.send({
                "queue": 'getFiles',
                "api": "sapi",
                "data": {
                    "method": "get_files",
                    "id_token": cookies['id_token']
                }
            })
            setDataFetching(false)
        }
    },[time,mapFileDetails,open])

    return(

        //TODO remove hardcoded style elements
         <div>

             { dataFetching &&
                 <Box component="div" sx={{
                     p:2,
                     mt:2,
                     border: '1px solid grey',
                     borderRadius: '5px' }}
                 >
                     <LinearProgress />
                 </Box>
             }

             {
                 mapFileDetails === null && tableData.length > 0 && open === false &&
                     <DataGrid style={{width: '100%'}}
                         rows={tableData}
                         columns={columns}
                               autoHeight
                         initialState={{
                           sorting: {
                               sortModel: [{ field: 'id', sort: 'desc' }],
                           },
                         }}
                     />
             }

             {
                 mapFileDetails === null && tableData.length > 0 && open === true &&
                     <AdminFileDetails
                         fileDetails = {fileDetailsData}
                         fileColumns = {fileColumns}
                         open = {setOpen}
                         forceRefresh = {setTime}
                         setFileDetails = {setMapFileDetails}
                     />
             }

             {
                 mapFileDetails === null && open === false &&
                 <>

                     <AdminFileUploader
                         forceRefresh = {setTime}
                     />
                 </>

             }

             {
                 mapFileDetails !== null &&
                     <AdminDataMapper
                        fileDetails = {mapFileDetails}
                        open = {setMapFileDetails}
                     />

             }

             {
                 mapFileDetails === null && open === false  &&
                     <AdminPlanningLoader
                         forceRefresh = {setTime}
                     />
             }

             {
                 mapFileDetails === null && open === false  &&
                 <AdminFloodMonitoringLoader
                     forceRefresh = {setTime}
                 />
             }

             {
                 mapFileDetails === null && open === false  &&
                 <AdminCrimeLoader
                     forceRefresh = {setTime}
                 />
             }

             {
                 mapFileDetails === null && open === false  &&
                 <AdminBoundaryLoader
                     forceRefresh = {setTime}
                 />
             }
             {
                 mapFileDetails === null && open === false  &&
                 <AdminEventsLoader
                     forceRefresh = {setTime}
                 />
             }
         </div>

    )
}