import React from "react";


import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import FormControl from "@material-ui/core/FormControl";
import {useStyles} from "theme_locus";


const SearchRange = ({changeFunction,currentValue}) => {
	const classes = useStyles();

	return (
		<FormControl className={classes.formControl} fullWidth>

			<InputLabel id="filter-range-select-label">Range</InputLabel>
			<NativeSelect
				labelId="filter-range-select-label"
				id="range-select"
				value={currentValue}
				onChange={changeFunction}
			>
				<option value="1">1</option>
				<option value="3">3</option>
				<option value="5">5</option>
				<option value="10">10</option>
				<option value="1000000000000">All</option>
			</NativeSelect>
		</FormControl>
	)
}

export default SearchRange;