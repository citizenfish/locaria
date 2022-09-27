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
               <Select id={id}>
                    <MenuItem key={"permPublic"}
                              value={"PUBLIC"}>PUBLIC</MenuItem>
                </Select>


            </Grid>

    </Grid>

    )
}

export default DataItemSelect;