import React from 'react';

import Grid from "@mui/material/Grid";
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import Typography from "@mui/material/Typography";

const DataItemSocialGeneric = ({name,data,sx}) => {
    return (
        <DataItemSocialBase data={data} name={name} icon={<OpenInBrowserIcon/>} sx={sx}/>
    )
}

const DataItemSocialInstagram = ({name,data,sx}) => {
    return (
        <DataItemSocialBase data={data} name={name} icon={<InstagramIcon/>} sx={sx}/>
    )
}

const DataItemSocialTwitter = ({name,data,sx}) => {
    return (
        <DataItemSocialBase data={data} name={name} icon={<TwitterIcon/>} sx={sx}/>
    )
}

const DataItemSocialFacebook = ({name,data,sx}) => {
    return (
        <DataItemSocialBase data={data} name={name} icon={<FacebookIcon/>} sx={sx}/>
    )
}

const DataItemSocialBase = ({name,data,sx,icon}) => {
    let sxActual={...{
            color: window.systemMain.fontMain,
            fontSize: "1rem"
        },...sx}
    let dataActual=data;
    if(typeof dataActual !=='string')
        dataActual=JSON.stringify(dataActual);
    return (
        <Grid container onClick={(e)=>{window.location=dataActual;}} sx={sxActual}>
            <Grid item md={1}>
                {icon}
            </Grid>
            <Grid item md={11}>
                <Typography>
                    {dataActual}
                </Typography>
            </Grid>
        </Grid>
    )
}



export {DataItemSocialTwitter,DataItemSocialFacebook,DataItemSocialInstagram,DataItemSocialGeneric};