import React from 'react';
import Typography from "@mui/material/Typography";

const DataItemP = ({name,data,sx}) => {
    let sxActual={...{
            color: window.systemMain.fontMain,
            fontSize: "1rem"
        },...sx}

    let dataActual = data;

    if(typeof dataActual !=='string') {
        dataActual = JSON.stringify(dataActual)
    }

    return (
        <Typography gutterBottom variant="p" sx={sxActual}>{dataActual}</Typography>
    )
}

export default DataItemP;