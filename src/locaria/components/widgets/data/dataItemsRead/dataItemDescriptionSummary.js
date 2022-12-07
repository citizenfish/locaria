import React from 'react';
import Typography from "@mui/material/Typography";

const DataItemDescriptionSummary = ({name,data}) => {
    return (
        <Typography gutterBottom variant="p" sx={{
            color: window.systemMain.fontMain,
            fontSize: "1rem"}}>
            {data}


        </Typography>
    )
}

export default DataItemDescriptionSummary;