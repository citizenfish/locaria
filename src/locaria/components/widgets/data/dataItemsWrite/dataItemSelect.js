import React, {useState} from 'react';
import {Select, TextField} from "@mui/material";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
const DataItemSelect = ({id,name,data}) => {

    const [dataLocal, setDataLocal]=useState(data);

    return (
        <Grid container spacing = {2}>
            <Grid item md={2}>
                  {name}
            </Grid>
            <Grid item md={4}>
                <Select>
                    <MenuItem key={"permPublic"}
                              value={"PUBLIC"}>PUBLIC</MenuItem>
                </Select>



                {/*<TextField
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
                    sx={{
                        color: "black"
                    }}
                    onChange={(e)=>{setDataLocal(e.target.value)}}
                />*/}
            </Grid>

    </Grid>

    )
}

export default DataItemSelect;