import React, { useState} from 'react';
import TokenCheck from "widgets/utils/tokenCheck";
import Box from "@mui/material/Box"
import AdminAppBar from "../adminAppBar"
import LeftNav from "../components/navs/leftNav"
import FileUploader from "../../widgets/files/fileUploader";
import AdminFileSelector from "../components/selectors/adminFileSelector";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {useDispatch, useSelector} from "react-redux";
import {setFile} from "../redux/slices/fileSelectSlice";


export default function AdminFileManager() {


    const [showUpload, setShowUpload] = useState(false)
    const fileSelected = useSelector((state) => state.fileSelect.currentSelected)
    const dispatch = useDispatch()

    return(
        <Box sx={{display: 'flex'}}>
            <TokenCheck adminMode={true}/>
            <AdminAppBar title={`File Manager`}/>
            <LeftNav isOpenImport={true}/>

            <Box
                component="main"
                sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '60px'}}
            >
                <Grid container spacing={2}>
                    <Grid item md={4}>
                        <Button sx={{marginRight:"5px"}}
                                variant="outlined"
                                color="success"
                                disabled={showUpload}
                                onClick={() => {
                                        setShowUpload(true)
                        }}>
                            Upload file
                        </Button>
                        {showUpload &&
                        <Button variant="outlined"
                                color="error"
                                onClick={()=> {setShowUpload(false)}}>Hide Upload
                        </Button>}
                        {fileSelected['id'] !== undefined &&
                        <Button variant = "outlined"
                                color = "error"
                                onClick={() => {dispatch(setFile({}))}}>Back to Files
                        </Button>}
                    </Grid>
                    <Grid item md={6}>
                        <Typography>The file manager allows you to upload files and import data into Locaria. A wide variety of file formats are supported including Microsoft Excel, CSV and geospatial formats supported by the GDAL libraries.</Typography>
                    </Grid>
                </Grid>
                {showUpload && <FileUploader setShowUpload={setShowUpload}/>}
                <AdminFileSelector/>
            </Box>
        </Box>
    )
}