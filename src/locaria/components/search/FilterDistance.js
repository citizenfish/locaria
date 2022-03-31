import React from "react";

import {configs, theme, channels} from "themeLocaria";
import InputLabel from "@mui/material/InputLabel";
import {useSelector, useDispatch} from 'react-redux'
import FormControl from "@mui/material/FormControl";
import {useStyles} from "stylesLocaria";
import Slider from "@mui/material/Slider";
import {
	setDistance
} from "../redux/slices/searchDrawSlice";

const FilterDistance = ({min = 0, max = 100, step = 1}) => {
	const classes = useStyles();

	const dispatch = useDispatch()
	const distance = useSelector((state) => state.searchDraw.distance);
	const [value, setValue] = React.useState(distance);

	React.useEffect(() => {
		setValue(distance);
	}, [distance]);

	function valuetext(value) {
		return `${value} things`;
	}

	const handleChange = (event, newValue) => {
		dispatch(setDistance(newValue));
	};
	const handleChangeShow = (event, newValue) => {
		setValue(newValue);
	}
	return (
		<FormControl className={classes.formControl} fullWidth>
			<Slider
				sx={{color: "secondary.main"}}
				id={"distance-select"}
				getAriaLabel={() => 'Distance'}
				value={value}
				valueLabelDisplay="auto"
				valueLabelFormat={(x)=>{return x+'km'}}
				getAriaValueText={valuetext}
				onChange={handleChangeShow}
				onChangeCommitted={handleChange}
				min={min}
				max={max}
				key={'distanceSlider'}
				step={step}
			/>
		</FormControl>
	)
}

export default FilterDistance;