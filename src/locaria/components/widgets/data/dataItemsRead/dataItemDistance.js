import React from 'react';
import Typography from "@mui/material/Typography";
import {useSelector} from "react-redux";
import {distanceFormatNice} from "../../../../libs/Distance";

const DataItemDistance = ({name,data,sx}) => {

    const distanceType = useSelector((state) => state.searchDraw.distanceType);


    let sxActual={...{
            color: window.systemMain.fontMain,
            fontSize: "1rem"
        },...sx}
    let dataActual=data;
    if(typeof dataActual !=='string')
        dataActual=JSON.stringify(dataActual);
    return (
        <Typography gutterBottom variant="p" sx={sxActual}>{distanceFormatNice(dataActual,distanceType,1)}</Typography>
    )
}

export default DataItemDistance;