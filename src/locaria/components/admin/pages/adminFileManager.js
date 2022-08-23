import React, {useEffect, useState} from 'react';
import TokenCheck from "../components/utils/tokenCheck";
import Box from "@mui/material/Box"
import AdminAppBar from "../adminAppBar"
import LeftNav from "../components/navs/leftNav"
import AdminFileUploader from "../components/adminFileUploader";
import AdminFileSelector from "../components/selectors/adminFileSelector";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";


export default function AdminFileManager() {


    const [showUpload, setShowUpload] = useState(false)


    return(
        <Box sx={{display: 'flex'}}>
            <TokenCheck></TokenCheck>
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
                                onClick={() => {
                                        setShowUpload(true)
                        }}>
                            Upload file
                        </Button>
                    </Grid>
                    <Grid item md={6}>
                        <Typography>The file manager allows you to upload files and import data into Locaria. A wide variety of file formats are supported including Microsoft Excel, CSV and geospatial formats supported byt the GDAL libraries.</Typography>
                    </Grid>
                </Grid>

                {!showUpload && <AdminFileSelector/>}
                {showUpload && <AdminFileUploader/>}
            </Box>
        </Box>
    )
}