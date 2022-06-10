import React from 'react';
import Typography from "@mui/material/Typography";

const DataItemH2 = ({name,data}) => {
    return (
        <Typography gutterBottom variant="h2" sx={{
            color: window.systemMain.fontSecondary,
            fontWeight: 200,
            fontSize: "1rem"
        }}>{data} </Typography>
    )
}

export default DataItemH2;