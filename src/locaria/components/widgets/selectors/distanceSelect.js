import React from 'react';

import {
    setDistance
} from "../../redux/slices/searchDrawerSlice";

import {configs} from 'themeLocaria';
import {useStyles} from "stylesLocaria";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {Divider} from "@mui/material";

import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";


import FilterDistance from "../../search/FilterDistance";


const DistanceSelect = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch()

    const distance = useSelector((state) => state.searchDraw.distance);

    return (
        <Box sx={ {mw:300, p:1}}>

            <Typography className={classes.distanceSelectText}>{configs.distanceSelectText}:&nbsp;
                {distance > 0 && `within : ${distance}km`}
                {distance === 0 && "All items"}
            </Typography>


            <Divider/>
            <FilterDistance/>
            <Divider/>
            <Typography variant="body1"
                        className={classes.resetCategorySelectText}
                        onClick={() => {dispatch(setDistance(false))}}
                        sx={{m:1}}
            >
                {configs.resetDistanceText}
            </Typography>
        </Box>
    )
}

export default DistanceSelect;