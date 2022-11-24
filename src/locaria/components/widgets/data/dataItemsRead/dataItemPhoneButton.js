import React from 'react';
import Button from "@mui/material/Button";

import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
const DataItemPhoneButton = ({name,data,sx,size="small"}) => {
    let sxActual={...{
            color: window.systemMain.fontMain,
            margin: "2px"
            //fontSize: "0.5rem"
        },...sx}
    let dataActual=data;
    if(typeof dataActual !=='string')
        dataActual=JSON.stringify(dataActual);
    return (
        <Button size={size} variant="outlined" sx={sxActual} onClick={()=>{
            window.open(`tel:${dataActual}`,"_blank");
        }} endIcon={<PhoneInTalkIcon />}>{name}</Button>
    )
}

export default DataItemPhoneButton;