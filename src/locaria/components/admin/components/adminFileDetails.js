import React, {useEffect} from "react"
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {DataGrid} from '@mui/x-data-grid'
import Button from "@mui/material/Button";
import Divider from '@mui/material/Divider';
import AdminDialogConfirm from "../dialogues/adminDialogueConfirm";
import {useCookies} from "react-cookie";


export default function AdminFileDetails(props) {
    let fileDetails = props.fileDetails
    console.log(fileDetails)
    //Add a mandatory id to each column
    fileDetails.log_messages = fileDetails.log_messages.map((x,i) => {x.id = i + 1;return x})
    let statusColour = fileDetails.status === 'FARGATE_PROCESSED' ? 'success' :
                       fileDetails.status === 'FARGATE_ERROR' ? 'error' : 'secondary'

    //Dialogues
    const [dialogProps, setDialogueProps] = React.useState({open : false});

    //API
    const [cookies, setCookies] = useCookies(['location'])

    //Delete file function
    const deleteFile = () => {
        console.log(`DELETE FILE ${fileDetails.id}`)
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
        console.log(`REPROCESS FILE ${fileDetails.id}`)
        window.websocket.send({
            queue: 'fileDetails',
            api: "sapi",
            data: {
                method: "update_file",
                id : fileDetails.id,
                status: 'REGISTERED',
                message: 'Resubmitted by administrator',
                id_token: cookies['id_token']
            }
        })
        console.log()
    }

    //File process websocket

    useEffect(() =>{
        //Register the initial ws queue for getting details of files, only fired once on render
        window.websocket.registerQueue("fileDetails", function(json){
            console.log(json)
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
                <Box component="div" sx = {{mb: 2}}>
                    <Grid container spacing = {2}>
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
                                   fileDetails.status !== 'REGISTERED' &&
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
                            {fileDetails.ext}
                        </Typography>
                    </Grid>

                    {
                    fileDetails.status === 'FARGATE_PROCESSED' &&
                        <>
                        <Grid item xs={4}>
                            <Typography variant="subtitle1" noWrap>
                                Record count
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="subtitle1" noWrap>
                                {fileDetails.record_count}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="subtitle1" noWrap>
                                Processing Time
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="subtitle1" noWrap>
                                {fileDetails.processing_time} seconds
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="subtitle1" noWrap>
                                File Actions
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                                <Button variant='contained'
                                        color='success'
                                        onClick = {() => {
                                            props.setFileDetails(fileDetails)
                                            props.open(false)
                                        }}
                                >
                                    Load File Data
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
                style={{height: 370, width: '100%'}}
                columns={props.fileColumns}
                rows={fileDetails.log_messages}
                pageSize={5}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'id', sort: 'asc' }],
                    },
                }}
            />


        </div>
    )
}