import React, {useEffect, useRef,useState} from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {useCookies} from "react-cookie";
import axios from 'axios'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LinearProgressWithLabel from '../../admin/components/utils/LinearProgress';

let file

export default function FileUploader(props) {

    const fileInput = useRef(null)
    const [cookies, setCookies] = useCookies(['location']);
    const [fileProgress,setFileProgress] = useState(0)
    const [dragActive, setDragActive] = React.useState(false);

    const handleDrag = (e) => {

        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop =(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            console.log(e.dataTransfer.files[0])
            handleFileInput({target: {files:[e.dataTransfer.files[0]]}})
        }
    }

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
                    "ext" : extension,
                    "upload": true
                },
                "contentType" : contentType,
                "id_token": cookies['id_token']
            }
        })

     }

    useEffect( () => {
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
                    //setFileProgress(0)
                })
                .catch(function(err) {
                    console.log(err)
                    setFileProgress(-1)
                })

        })
    },[])

   return (
       <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
           <Box
               component="div"
               sx={{
                   p:2,
                   mt:2,
                   border: '2px dashed #c3c4c7',
                   borderRadius: 1,
                   display: "flex",
                   ...(dragActive && {backgroundColor: 'rgba(176,176,176,0.38)'}),
                   ...(!dragActive && {backgroundColor: '#efeded'})
               }}
           >
               <Grid container spacing={1}>

                   <Grid item md={12} sx={{justifyContent: "center", alignItems:"center", display: "flex", flexDirection:'column'}}>
                         <input type="file"
                                id = "fileUploadButton"
                                style = {{display :'none'}}
                                onChange={handleFileInput} />
                       <Typography variant={'subtitle1'}>Drop a file to upload</Typography>
                       <Typography paragraph = {true} variant={'body2'}>or</Typography>
                         <label htmlFor={'fileUploadButton'}>
                             {
                                 (fileProgress === 0 || fileProgress === 100) &&
                                 <Button variant="outlined"
                                         onClick={e => fileInput.current && fileInput.current.click() }
                                         component="span">
                                     Select File
                                 </Button>
                             }
                             { fileProgress > 0 && fileProgress < 100 &&
                                <Button variant="outlined"
                                        disabled={true}>Uploading ..</Button> }
                             { fileProgress === -1 &&
                                <Button variant={"contained"}
                                        onClick={() => {setFileProgress(0)}}>Upload ERROR</Button>}

                         </label>
                   </Grid>
               </Grid>
           </Box>
           {file !== undefined && fileProgress !== 0 && fileProgress !== 100 &&
               <Box
                   component="div"
                   sx={{
                       mt:2,
                       border: '1px solid rgba(224, 224, 224, 1)',
                       borderRadius: 1,
                       display: "flex",
                       p:2,
                       justifyContent: "center",
                       alignItems:"center",
                       flexDirection:'column'
                   }}
               >
                           <Typography variant="subtitle1" noWrap>
                               Uploading
                           </Typography>
                           <Typography variant="subtitle1" noWrap>
                               <b>{file.name}</b>
                           </Typography>
                           {fileProgress > 0 && fileProgress < 100 && <LinearProgressWithLabel value={fileProgress} />}
               </Box>
           }
       </div>
   )
}