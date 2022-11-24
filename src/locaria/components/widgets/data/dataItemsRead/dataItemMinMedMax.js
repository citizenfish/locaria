import React from 'react';

import {Skeleton} from "@mui/lab";
import {Stack} from "@mui/material";
const DataItemMinMedMax = ({name,data,sx,min=1000,max=10000}) => {
    let sxActual={...{
            color: window.systemMain.fontMain,
            //fontSize: "0.5rem"
        },...sx}
    let dataActual=data;
    if(typeof dataActual !=='string')
        dataActual=JSON.stringify(dataActual);
    dataActual=parseInt(dataActual);
    return (
        <Stack direction="row" spacing={0} sx={{padding: "5px"}}>
            <Skeleton variant="rectangular" width={20} height={10}  animation="wave" sx={{backgroundColor:"green"}}/>
            {dataActual>min&&
                <Skeleton variant="rectangular" width={20} height={10} animation="wave"
                          sx={{backgroundColor: "orange"}}/>
            }
            {dataActual>= max &&
                <Skeleton variant="rectangular" width={20} height={10} animation="wave" sx={{backgroundColor: "red"}}/>
            }
        </Stack>
    )
}

export default DataItemMinMedMax;