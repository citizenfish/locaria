import React from 'react';
import Typography from "@mui/material/Typography";

const DataItemTitle = ({name,data}) => {
    return (
        <Typography gutterBottom variant="h1"  sx={{
            color: window.systemMain.fontSecondary,
            fontWeight: 400,
            fontSize: "1.5rem"
        }}>{data} </Typography>
    )
}

export default DataItemTitle;