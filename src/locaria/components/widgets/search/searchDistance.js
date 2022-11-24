import React, {useState} from 'react';
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import {useDispatch, useSelector} from "react-redux";
import {setDistance, setDistanceType} from "../../redux/slices/searchDrawerSlice";
import {FormControlLabel, ListItem, ListItemText, Radio, RadioGroup} from "@mui/material";
import List from "@mui/material/List";

export default function SearchDistance({sx,category,maxDistance=20}) {
	const dispatch = useDispatch()

	const searchParams = useSelector((state) => state.searchDraw.searchParams);
	const distanceType = useSelector((state) => state.searchDraw.distanceType);
	const [localDistance,setLocalDistance]= useState(searchParams.distance);

	function handleChange(e,value) {
		setLocalDistance(value);
	}

	function handleSubmit() {
		dispatch(setDistance(localDistance));

	}

	function handleDistanceTypeChange(e) {
		dispatch(setDistanceType(e.target.value));
	}

	return (
		<Box sx={{marginTop:"20px"}}>
			<List sx={{ width: '100%' }} >
				<ListItem sx={{padding:"0px"}}>
					<ListItemText primary={`Distance`} />
					<RadioGroup
						row
						name="position"
						defaultValue="start"
					>
						<FormControlLabel
							checked={distanceType==='km'}
							onChange={handleDistanceTypeChange}
							value="km"
							control={<Radio />}
							label="km"
							labelPlacement="start"
						/>
						<FormControlLabel
							checked={distanceType==='miles'}
							onChange={handleDistanceTypeChange}
							value="miles"
							control={<Radio />}
							label="miles"
							labelPlacement="start"
						/>
					</RadioGroup>
				</ListItem>
				<ListItem sx={{padding:"0px"}}>

					<Slider defaultValue={searchParams.distance} aria-label="Default" valueLabelDisplay="auto" onChange={handleChange} onTouchEnd={handleSubmit} onMouseUp={handleSubmit} max={maxDistance}/>
				</ListItem>
			</List>
		</Box>
	)
}