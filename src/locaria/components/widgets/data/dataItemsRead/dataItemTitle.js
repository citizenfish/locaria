import React from 'react';
import Typography from "@mui/material/Typography";

const DataItemTitle = ({name,data,sx}) => {
    let sxActual={...{
            color: window.systemMain.fontSecondary,
            fontWeight: 400,
            fontSize: "1.5rem"
        },...sx}
    return (
        <Typography gutterBottom variant="h1" sx={sxActual}>{data} </Typography>
    )
}

export default DataItemTitle;