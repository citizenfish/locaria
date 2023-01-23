import React from 'react';
import TokenCheck from "widgets/utils/tokenCheck";
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AdminModerationSelector from "../components/selectors/adminModerationSelector";

export default function AdminModerationList() {

    return(
        <Box sx={{display: 'flex'}}>
            <TokenCheck adminMode={true}/>
            <AdminAppBar title={`API Settings`}/>
            <LeftNav isOpenContent={true}/>

            <Box
                component="main"
                sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '60px'}}>

                <Grid container spacing={2}>
                    <Grid item md={4}>
                        <Button sx={{marginRight:"5px"}}
                                variant="outlined"
                                color="success"

                                onClick={() => {

                                }}>
                            Publish All
                        </Button>

                    </Grid>
                    <Grid item md={6}>
                        <Typography>The moderation system allows you to moderate content.</Typography>
                    </Grid>
                </Grid>
                <AdminModerationSelector/>
            </Box>
        </Box>
    )
}