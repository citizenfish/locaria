import React, {useEffect, useState} from 'react';
import TokenCheck from "../components/utils/tokenCheck";
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FileDownloader from "../../widgets/files/fileDownloader";
import AdminDownloadSelector from "../components/selectors/adminDownloadSelector";


export default function AdminDownload() {

    const [showDownload,setShowDownload] = useState(false)

    return(
        <Box sx={{display: 'flex'}}>
            <TokenCheck></TokenCheck>
            <AdminAppBar title={`Download Data`}/>
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
                                    setShowDownload(true)
                                }}>
                            Download Data
                        </Button>
                    </Grid>
                    <Grid item md={6}>
                        <Typography>Data can be downloaded from Locaria in CSV, JSON or Geopackage format. You can filter data by category or tags</Typography>
                    </Grid>
                </Grid>

                {showDownload && <FileDownloader show = {setShowDownload}/>}
            <AdminDownloadSelector/>
            </Box>
        </Box>
    )
}