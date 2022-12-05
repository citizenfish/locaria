import React, {useEffect, useRef, useState} from 'react';
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import {useDispatch, useSelector} from "react-redux";
import {setDistance, setDistanceType} from "../../redux/slices/searchDrawerSlice";
import {FormControlLabel, ListItem, ListItemText, Radio, RadioGroup, Stack} from "@mui/material";
import List from "@mui/material/List";
import Button from "@mui/material/Button";

export default function SearchDistance({sx,category,maxDistance=20,minDistance=1}) {
	const dispatch = useDispatch()

	const searchParams = useSelector((state) => state.searchDraw.searchParams);
	const [localDistance,setLocalDistance]= useState(searchParams.distance);

	function handleChange(e,value) {
		setLocalDistance(value);
	}

	function handleSubmit() {
		dispatch(setDistance(localDistance));

	}

	function toggleDistanceType() {
		if(searchParams.distanceType==='km')
			dispatch(setDistanceType('miles'));
		else
			dispatch(setDistanceType('km'));

	}

	const marks=[
		{value:1,label:1},
		{value:5,label:5},
		{value:10,label:10},
		{value:15,label:15},
		{value:20,label:20}
	]
	return (
			<Stack direction="row" spacing={2} sx={{marginTop:"20px"}}>
				<Slider marks={marks} defaultValue={searchParams.distance? parseInt(searchParams.distance):1} valueLabelDisplay="auto" aria-label="Default"  onChange={handleChange} onTouchEnd={handleSubmit} onMouseUp={handleSubmit} min={minDistance} max={maxDistance}/>
				<Button variant={"outlined"} onClick={()=>{
					toggleDistanceType();
				}}>{searchParams.distanceType}</Button>
			</Stack>
	)
}