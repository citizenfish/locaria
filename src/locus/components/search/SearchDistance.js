import React from "react";


import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import FormControl from "@material-ui/core/FormControl";
import {useStyles} from "themeLocus";
import Slider from "@material-ui/core/Slider";


const SearchDistance = ({changeFunction,currentValue,min,max}) => {
	min=min||0;
	max=max||100;
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
			<InputLabel id="filter-distance-select-label">Distance</InputLabel>
			<Slider
				labelId="filter-distance-select-label"
				getAriaLabel={() => 'Distance'}
				value={value}
				valueLabelDisplay="auto"
				getAriaValueText={valuetext}
				onChange={handleChange}
				onChangeCommitted={changeFunction}
				disableSwap
				min={min}
				max={max}
			/>
		</FormControl>
	)
}

export default SearchDistance;