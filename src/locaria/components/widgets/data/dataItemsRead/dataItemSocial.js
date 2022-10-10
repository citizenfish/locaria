import React from 'react';

import Grid from "@mui/material/Grid";
import TwitterIcon from '@mui/icons-material/Twitter';
import Typography from "@mui/material/Typography";

const DataItemSocialTwitter = ({name,data,sx}) => {
    let sxActual={...{
            color: window.systemMain.fontMain,
            fontSize: "1rem"
        },...sx}
    let dataActual="foo";
    if(typeof dataActual !=='string')
        dataActual=JSON.stringify(dataActual);
    return (
        <Grid container onClick={(e)=>{window.location=dataActual;}}>
            <Grid item md={4}>
                <TwitterIcon/>
            </Grid>
            <Grid item md={8}>
                <Typography>
                    {{dataActual}}
                </Typography>
            </Grid>
        </Grid>
    )
}

export {DataItemSocialTwitter};