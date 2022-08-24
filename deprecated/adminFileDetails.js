import React, {useEffect} from "react"
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {DataGrid} from '@mui/x-data-grid'
import Button from "@mui/material/Button";
import Divider from '@mui/material/Divider';
import AdminDialogConfirm from "../locaria/components/admin/dialogues/adminDialogueConfirm";
import {useCookies} from "react-cookie";


export default function AdminFileDetails(props) {
    let fileDetails = props.fileDetails
    //Add a mandatory id to each column
    fileDetails.log_messages = fileDetails.log_messages.map((x,i) => {x.id = i + 1;return x})
    let statusColour = /COMPLETED|PROCESSED/.test(fileDetails.status) ? 'success' :
                       /ERROR/.test(fileDetails.status)  ? 'error' : 'secondary'

    //Dialogues
    const [dialogProps, setDialogueProps] = React.useState({open : false});

    //API
    const [cookies, setCookies] = useCookies(['location'])

    //Delete file function
    const deleteFile = () => {
        window.websocket.send({
            queue: 'fileDetails',
            api: "sapi",
            data: {
                method: "delete_file",
                id : fileDetails.id,
                id_token: cookies['id_token']
            }
        })

    }

    const resubmitFile = () => {
        window.websocket.send({
            queue: 'fileDetails',
            api: "sapi",
            data: {
                method: "update_file",
                id : fileDetails.id,
                status: fileDetails.status === 'IMPORTED' ? 'FARGATE_PROCESSED' : 'REGISTERED',
                attributes: {processed: 0},
                message: 'Resubmitted by administrator',
                id_token: cookies['id_token']
            }
        })

    }

    //File process websocket

    useEffect(() =>{
        //Register the initial ws queue for getting details of files, only fired once on render
        window.websocket.registerQueue("fileDetails", function(json){

            if(json.packet.id !== undefined) {
                props.forceRefresh(Date.now())
                props.open(false)
            } else {
                setDialogueProps({
                    open : true,
                    title: 'ERROR',
                    text:'The requested operation could not be completed',
                    dismissText: 'Dismiss',
                    confirmText: '',
                    confirmFunction: () =>{},
                    openSet : setDialogueProps
                })
            }

        })
    },[])

    return(
        <div>
            <AdminDialogConfirm
                p = {dialogProps}
            />
            <Box
                component="div" sx={{
                p:2,
                mb:2,
                border: '1px solid grey',
                borderRadius: '5px' }}
            >
                <Grid container spacing = {1}>
                    <Grid item xs={4}>
                        <Typography variant="subtitle1" noWrap>
                            File Name
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="subtitle1" noWrap>
                            {fileDetails.name}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>

            <Box
                component="div" sx={{
                p:2,
                mb:2,
                border: '1px solid grey',
                borderRadius: '5px' }}
            >
                <Box component="div" sx = {{mb: 2}}>
                    <Grid container spacing = {1}>

                    <Grid item xs={4}>
                        <Typography variant="subtitle1" noWrap>
                            Status
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                           <Typography variant="subtitle1" noWrap>
                               <Button variant='contained'
                                       color={statusColour}
                               >
                                   {fileDetails.status}
                               </Button>
                               {
                                   fileDetails.status !== 'REGISTERED'
                                   && !/DOWNLOAD/.test(fileDetails.status)
                                   &&
                                   <Button variant='outlined'
                                           color = 'error'
                                           style = {{marginLeft: 10 }}
                                           onClick = {() => {

                                               setDialogueProps({
                                                   open : true,
                                                   title: 'Resubmit File',
                                                   text:'Are you sure you want to resubmit this file?',
                                                   dismissText: 'Cancel',
                                                   confirmText: 'Resubmit',
                                                   confirmFunction: resubmitFile,
                                                   openSet : setDialogueProps
                                                })
                                           }}
                                   >
                                       Resubmit File
                                   </Button>
                               }
                           </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="subtitle1" noWrap>
                            Type
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="subtitle1" style = {{textTransform: 'uppercase'}} noWrap>
                            {fileDetails.ext || fileDetails.format}
                        </Typography>
                    </Grid>
                        {!/DOWNLOAD/.test(fileDetails.status) &&
                            <>
                                <Grid item xs={4}>
                                    <Typography variant="subtitle1" noWrap>
                                        Loaded
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant="subtitle1" noWrap>
                                        {
                                            fileDetails.status !== 'REGISTERED' && <div>
                                                {fileDetails.processed || 0} of {fileDetails.record_count} records
                                            </div>

                                        }
                                        {
                                            fileDetails.status === 'REGISTERED' && <div>
                                                Awaiting file load
                                            </div>
                                        }

                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="subtitle1" noWrap>
                                        Load Time
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant="subtitle1" noWrap>
                                        {fileDetails.processing_time || 0} seconds
                                    </Typography>
                                </Grid>
                            </>
                        }
                        {
                            (fileDetails.status === 'FARGATE_PROCESSED' || fileDetails.status === 'IMPORTING') &&
                            <>
                                <Grid item xs={4}>
                                    <Typography variant="subtitle1" noWrap>
                                        File Actions
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                        <Button variant='contained'
                                                color='success'
                                                onClick = {() => {

                                                    if(fileDetails.status === 'IMPORTING'){
                                                        fileDetails['continueLoad'] = true
                                                    }

                                                    props.setFileDetails(fileDetails)
                                                    props.open(false)
                                                }}
                                        >
                                            {fileDetails.status === 'IMPORTING' && 'Continue Loading'}
                                            {fileDetails.status !== 'IMPORTING' && 'Map Data'}
                                        </Button>
                                </Grid>
                            </>
                        }
                        {
                            fileDetails.status === 'DOWNLOAD_COMPLETED' &&
                            <>
                                <Grid item xs={4}>
                                    <Typography variant="subtitle1" noWrap>
                                        Actions
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Button variant='contained'
                                            color={statusColour}>
                                        Download
                                    </Button>
                                </Grid>
                            </>
                        }
                    </Grid>
                </Box>

                <Divider variant="middle"/>

                <Box component="div" sx = {{mt: 2, mx: 'auto'}}>
                    <Grid container spacing = {2}>
                    <Grid item xs={4}>
                        <Typography variant ="subtitle1" noWrap>
                            <Button variant ='outlined'
                                    color   = 'error'
                                    onClick = {() => {

                                        setDialogueProps({
                                            open : true,
                                            title: 'Delete File',
                                            text:'Are you sure you want to delete this file?',
                                            dismissText: 'Cancel',
                                            confirmText: 'Delete',
                                            confirmFunction: deleteFile,
                                            openSet : setDialogueProps
                                        })
                                    }}
                            >
                                Delete File
                            </Button>
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="subtitle1" noWrap>
                            <Button variant='outlined'
                                    onClick = {() => {
                                        props.open(false)
                                    }}
                            >
                                Exit
                            </Button>
                        </Typography>
                    </Grid>
                </Grid>
                </Box>
            </Box>
            <DataGrid
                style={{width: '100%'}}
                columns={props.fileColumns}
                rows={fileDetails.log_messages}
                autoHeight
                rowHeight={30}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'id', sort: 'asc' }],
                    },
                }}
            />

        </div>
    )
}