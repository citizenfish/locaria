import React from 'react';
import Typography from "@mui/material/Typography";

const DataItemDescription = ({name,data}) => {
    return (
        <Typography gutterBottom variant="p" sx={{
            color: window.systemMain.fontMain,
            fontSize: "1rem"
        }}>{data} </Typography>
    )
}

export default DataItemDescription;