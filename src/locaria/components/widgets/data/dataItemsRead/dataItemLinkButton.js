import React from 'react';
import Button from "@mui/material/Button";

const DataItemLinkButton = ({name,data,sx}) => {
    let sxActual={...{
            color: window.systemMain.fontMain,
            fontSize: "1rem"
        },...sx}
    let dataActual=data;
    if(typeof dataActual !=='string')
        dataActual=JSON.stringify(dataActual);
    return (
        <Button variant="outlined" sx={sxActual} onClick={()=>{
            window.open(dataActual,"_blank");
        }}>{name}</Button>
    )
}

export default DataItemLinkButton;