import React from 'react';
import Typography from "@mui/material/Typography";

const DataItemP = ({name,data,sx}) => {
    let sxActual={...{
            color: window.systemMain.fontMain,
            fontSize: "1rem"
        },...sx}
    return (
        <Typography gutterBottom variant="p" sx={sxActual}>{data} </Typography>
    )
}

export default DataItemP;