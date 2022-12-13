import React from 'react';
import Typography from "@mui/material/Typography";
import Box  from "@mui/material/Box"

const DataItemP = ({name,data,sx,variant="p"}) => {
    let sxActual={...{
            color: window.systemMain.fontMain,
            fontSize: "1rem"
        },...sx}

    let dataActual = data;

    if(typeof dataActual !=='string') {
        dataActual = JSON.stringify(dataActual)
    }

    return (
            <Typography gutterBottom variant={variant} sx={sxActual}>{dataActual}</Typography>
    )
}

export default DataItemP;