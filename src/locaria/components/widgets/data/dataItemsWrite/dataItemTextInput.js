import React, {useState} from 'react';
import {TextField} from "@mui/material";
import Grid from "@mui/material/Grid";
const DataItemTextInput = ({id,name,data}) => {

    const [dataLocal, setDataLocal]=useState(data);

    return (
        <Grid container spacing = {2}>
            <Grid item md={2}>
                  {name}
            </Grid>
            <Grid item md={4}>
                <TextField
                    margin="dense"
                    id={id}
                    //label={name}
                    type="text"
                    fullWidth
                    variant="outlined"
                    inputProps={{style: {
                            padding: 5
                        }}}
                    value={dataLocal}
                    onChange={(e)=>{setDataLocal(e.target.value)}}
                />
            </Grid>

    </Grid>

    )
}

export default DataItemTextInput;