import React from 'react';
import Button from "@mui/material/Button";
import LaunchIcon from '@mui/icons-material/Launch';


const DataItemLinkButton = ({name,data,sx,size="small"}) => {
    let sxActual={...{
            color: window.systemMain.fontMain,
            margin: "2px"
            //fontSize: "0.5rem"
        },...sx}
    let dataActual=data;
    if(typeof dataActual !=='string')
        dataActual=JSON.stringify(dataActual);
    return (
        <Button size={size} variant="text" sx={sxActual} onClick={()=>{
            window.open(dataActual,"_blank");
        }} endIcon={<LaunchIcon />}>{name}</Button>
    )
}

export default DataItemLinkButton;