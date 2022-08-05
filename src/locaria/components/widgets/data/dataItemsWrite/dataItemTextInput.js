import React from 'react';
import Typography from "@mui/material/Typography";
import {TextField} from "@mui/material";

const DataItemTextInput = ({name,data}) => {
    return (
        <TextField
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            value={data}
        />
    )
}

export default DataItemTextInput;