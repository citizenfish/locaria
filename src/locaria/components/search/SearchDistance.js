import React from "react";


import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import FormControl from "@mui/material/FormControl";
import {useStyles} from "stylesLocaria";
import Slider from "@mui/material/Slider";


const SearchDistance = ({changeFunction, currentValue, min = 0, max = 100}) => {
	const classes = useStyles();
	const [value, setValue] = React.useState(parseInt(currentValue));

	function valuetext(value) {
		return `${value} things`;
	}

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	return (
		<FormControl className={classes.formControl} fullWidth>
			<InputLabel htmlFor="distance-select">Distance</InputLabel>
			<Slider
				id={"distance-select"}
				getAriaLabel={() => 'Distance'}
				value={value}
				valueLabelDisplay="auto"
				getAriaValueText={valuetext}
				onChange={handleChange}
				onChangeCommitted={changeFunction}
				min={min}
				max={max}
				key={'distanceSlider'}
			/>
		</FormControl>
	)
}

export default SearchDistance;