import React, {useEffect, useRef,useState} from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {useCookies} from "react-cookie";
import axios from 'axios'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LinearProgressWithLabel from './LinearProgress';

let file

export default function AdminFileUploader(props) {

    const fileInput = useRef(null)
    const [cookies, setCookies] = useCookies(['location']);
    const [fileProgress,setFileProgress] = useState(0)


    const handleFileInput = (e) => {
        // TODO handle validations etc...
        file = e.target.files[0]

        let extension = file.name.split(".").pop().toLowerCase()
        let contentType = file.type

        window.websocket.send({
            "queue" : 'addFile',
            "api" : "lapi",
            "data" : {
                "method": "add_file",
                "file_attributes" : {
                    "file_type" : contentType,
                    "name" : file.name,
                    "ext" : extension
                },
                "contentType" : contentType,
                "id_token": cookies['id_token']
            }
        })

     }

    useEffect( () => {
        console.log("REGISTER addFile handler")
        window.websocket.registerQueue("addFile", function (json) {

            let url = json.packet.url
            let config = {
                onUploadProgress: function(progressEvent) {
                    let completed = Math.round( (progressEvent.loaded * 100) / progressEvent.total )
                    setFileProgress(completed)
                },
                headers : {
                    'Content-Type' : file.type
                }
            }

            axios.put(url,  file, config)
                .then(function (res) {
                    setFileProgress(0)
                    props.forceRefresh(Date.now())
                })
                .catch(function(err) {
                    setFileProgress(-1)
                })

        })
    },[])

   return (
       <Box
           component="div"
           sx={{
               p:2,
               mt:2,
               flexGrow: 1,
           }}
       >
           <Grid container spacing={3}>
               <Grid item xs={2}>
                     <input type="file"
                            id = "fileUploadButton"
                            style = {{display :'none'}}
                            onChange={handleFileInput} />
                     <label htmlFor={'fileUploadButton'}>
                         {
                             fileProgress == 0 &&
                             <Button variant="contained"
                                     onClick={e => fileInput.current && fileInput.current.click() }
                                     component="span">
                                 Upload File
                             </Button>
                         }
                         { fileProgress > 0 && <Button variant="contained">Uploading ..</Button> }
                         { fileProgress === -1 && <Button variant={"contained"}
                                                          onClick={() => {setFileProgress(0)}}>Upload ERROR</Button>}
                     </label>
               </Grid>
               <Grid item xs={4}>
                   <Typography variant="subtitle1" noWrap>
                       {file !== undefined && fileProgress !== 0 && file.name}
                   </Typography>
               </Grid>
               <Grid item xs={4}>
                   {fileProgress > 0 && <LinearProgressWithLabel value={fileProgress} />}
               </Grid>
           </Grid>
       </Box>
   )
}