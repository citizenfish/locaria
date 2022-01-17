import React from "react";

import FormControl from "@mui/material/FormControl";
import Slider from '@mui/material/Slider';
import Typography from "@mui/material/Typography";


import {useStyles} from "stylesLocaria";
import InputLabel from "@mui/material/InputLabel";


const SearchRange = ({changeFunction, currentValueFrom, currentValueTo, title = 'Age', min = 0, max = 100}) => {
	const classes = useStyles();
	const [value, setValue] = React.useState([parseInt(currentValueFrom), parseInt(currentValueTo)]);

	function valuetext(value) {
		return `${value} things`;
	}

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<FormControl className={classes.formControl} fullWidth>
			<InputLabel id="filter-range-select-label">{title}</InputLabel>
			<Slider
				labelId="filter-range-select-label"
				getAriaLabel={() => 'Range'}
				value={value}
				valueLabelDisplay="auto"
				getAriaValueText={valuetext}
				onChange={handleChange}
				onChangeCommitted={changeFunction}
				min={min}
				max={max}
			/>
		</FormControl>
	)
}

export default SearchRange;