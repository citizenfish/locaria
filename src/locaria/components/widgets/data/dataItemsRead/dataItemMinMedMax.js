import React from 'react';

import {Stack,Skeleton,Grid} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {distanceFormatNice} from "../../../../libs/Distance";
import {useSelector} from "react-redux";

const DataItemMinMedMax = ({name,data, sx, min= 1000, max=10000, textPrompts = false}) => {

    const searchParams = useSelector((state) => state.searchDraw.searchParams);

    let sxActual={...{
            color: window.systemMain.fontMain
        },...sx}

    let dataActual=data;

    dataActual=parseInt(dataActual);

    if(textPrompts) {

        //TODO set via parameters
        let prompt = dataActual < min ? "Central" : dataActual > max ? 'Outskirts' : 'In Area'
        return(
            <Box sx = {sxActual}>
                <Grid container>
                    <Grid item md={12}>
                        <Typography gutterBottom variant="p">{prompt}</Typography>
                    </Grid>
                    <Grid item md={12}>
                        <Typography gutterBottom variant="body2">{distanceFormatNice(dataActual, searchParams.distanceType,1)}</Typography>
                    </Grid>
                </Grid>

            </Box>
        )
    }

    return (

                <Stack direction="row" spacing={0} sx={{padding: "5px"}}>
                    <Skeleton variant="rectangular" width={20} height={10}  animation="wave" sx={{backgroundColor:"green"}}/>
                    {
                        dataActual > min &&
                        <Skeleton variant="rectangular" width={20} height={10} animation="wave"
                                  sx={{backgroundColor: "orange"}}/>
                    }
                    {
                        dataActual >= max &&
                        <Skeleton variant="rectangular" width={20} height={10} animation="wave" sx={{backgroundColor: "red"}}/>
                    }
                </Stack>

    )
}

export default DataItemMinMedMax;