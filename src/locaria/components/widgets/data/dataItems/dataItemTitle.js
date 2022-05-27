import React from 'react';
import Typography from "@mui/material/Typography";

const DataItemTitle = ({name,data}) => {
    return (
        <Typography variant="h1" component="span" sx={{
            color: window.systemMain.fontSecondary,
            fontWeight: 400,
            fontSize: "1.5rem"
        }}>{data} </Typography>
    )
}

export default DataItemTitle;