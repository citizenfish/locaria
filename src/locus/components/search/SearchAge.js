import React from "react";


import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import FormControl from "@material-ui/core/FormControl";
import {useStyles} from "theme_locus";


const SearchAge = ({changeFunction,currentValue}) => {
	const classes = useStyles();

	return (
		<FormControl className={classes.formControl} fullWidth>

			<InputLabel id="filter-age-select-label">Age</InputLabel>
			<NativeSelect
				labelId="filter-age-select-label"
				id="age-select"
				value={currentValue}
				onChange={changeFunction}
			>
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="4">4</option>
				<option value="5">5</option>
				<option value="6">6</option>
				<option value="7">7</option>
				<option value="8">8</option>
				<option value="9">9</option>
				<option value="10">10</option>
				<option value="11">11</option>
				<option value="12">12</option>
				<option value="13">13</option>
				<option value="14">14</option>
			</NativeSelect>
		</FormControl>
	)
}

export default SearchAge;