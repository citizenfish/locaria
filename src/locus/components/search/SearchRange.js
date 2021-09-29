import React from "react";

import FormControl from "@material-ui/core/FormControl";
import Slider from '@material-ui/core/Slider';
import Typography from "@material-ui/core/Typography";


import {useStyles} from "theme_locus";
import InputLabel from "@material-ui/core/InputLabel";


const SearchRange = ({changeFunction,currentValueFrom,currentValueTo}) => {
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
			<InputLabel id="filter-range-select-label">Age</InputLabel>
				<Slider
					labelId="filter-range-select-label"
					getAriaLabel={() => 'Range'}
					value={value}
					valueLabelDisplay="auto"
					getAriaValueText={valuetext}
					onChange={handleChange}
					onChangeCommitted={changeFunction}
					disableSwap
					min={0}
					max={25}
					/>
		</FormControl>
	)
}

export default SearchRange;