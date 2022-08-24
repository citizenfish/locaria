import React, {useState} from 'react';
import Typography from "@mui/material/Typography";
import {TextField} from "@mui/material";

const DataItemTextInput = ({id,name,data}) => {

    const [dataLocal, setDataLocal]=useState(data);

    return (
        <TextField
            margin="dense"
            id={id}
            label={name}
            type="text"
            fullWidth
            variant="standard"
            value={dataLocal}
            onChange={(e)=>{setDataLocal(e.target.value)}}
        ></TextField>
    )
}

export default DataItemTextInput;