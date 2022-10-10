import React from 'react';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

const DataItemGrid = ({name,data,sx}) => {
    let sxActual={...{
            color: window.systemMain.fontMain,
            fontSize: "1rem"
        },...sx}
    let dataActual=data;
    if(typeof dataActual !=='string')
        dataActual=JSON.stringify(dataActual);
    return (
        <Grid container onClick={(e)=>{window.location=dataActual;}} sx={sxActual}>
            <Grid item md={3}>
                <Typography gutterBottom variant="p" >{name} </Typography>
            </Grid>
            <Grid item md={9}>
                <Typography gutterBottom variant="p" sx={{fontWeight: "bold"}}>{dataActual} </Typography>

            </Grid>
        </Grid>
    )
}

export default DataItemGrid;