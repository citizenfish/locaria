import React from 'react';
import Typography from "@mui/material/Typography";
import Box  from "@mui/material/Box"

const DataItemCost = ({name,data,sx}) => {
    let sxActual={...{
            color: window.systemMain.fontMain,
            fontSize: "1rem"
        },...sx}

    let dataActual = data;

    if(typeof dataActual !=='string') {
        dataActual = JSON.stringify(dataActual)
    }

    return (
        <Box sx = {sxActual}>
            <Typography gutterBottom variant="subtitle1">£ {dataActual}</Typography>
        </Box>
    )
}

export default DataItemCost;