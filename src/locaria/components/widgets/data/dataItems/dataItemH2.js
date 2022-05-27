import React from 'react';
import Typography from "@mui/material/Typography";

const DataItemH2 = ({name,data}) => {
    return (
        <Typography variant="h2" component="span" sx={{
            color: window.systemMain.fontSecondary,
            fontWeight: 200,
            fontSize: "1rem"
        }}>{data} </Typography>
    )
}

export default DataItemH2;