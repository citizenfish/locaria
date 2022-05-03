import React from 'react';

import {
    setDistance,
    setDistanceType
} from "../../redux/slices/searchDrawerSlice";

import {configs} from 'themeLocaria';
import {useStyles} from "stylesLocaria";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {Divider} from "@mui/material";

import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import Chip from "@mui/material/Chip";

import FilterDistance from "../../search/FilterDistance";
import Distance from "../../../libs/Distance";


const DistanceSelect = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch()
    const distanceLib = new Distance();

    const distance = useSelector((state) => state.searchDraw.distance);
    const distanceType = useSelector((state) => state.searchDraw.distanceType);

    return (
        <Box sx={ {mw:300, p:1}}>

            <Typography className={classes.distanceSelectText}>{configs.distanceSelectText}:&nbsp;
                {distance > 0 && `within : ${distance}${distanceLib.distanceLang(distanceType)}`}
                {distance === 0 && "All items"}
            </Typography>


            <Divider/>
            <FilterDistance/>
            <Divider/>
            <Chip label={"KM"} size="small" onClick={()=>{
                dispatch(setDistanceType('km'));
            }}></Chip>
            <Chip label={"Miles"} size="small" onClick={()=>{
                dispatch(setDistanceType('miles'));
            }}></Chip>
            <Typography variant="body1"
                        className={classes.resetCategorySelectText}
                        onClick={() => {dispatch(setDistance(0))}}
                        sx={{m:1}}
            >
                {configs.resetDistanceText}
            </Typography>
        </Box>
    )
}

export default DistanceSelect;