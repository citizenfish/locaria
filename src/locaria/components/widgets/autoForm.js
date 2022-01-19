import React from "react";

import FormControl from "@mui/material/FormControl";
import Slider from '@mui/material/Slider';
import Typography from "@mui/material/Typography";


import {channels} from "themeLocaria";
import {useStyles} from "stylesLocaria";

import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";


const autoForm = ({category, properties}) => {
	const classes = useStyles();

	let channel = channels.getChannelProperties(category);


	function onChange(e) {
		properties[e.target.name] = e.target.value;
	}

	return (
		<div>
			<FormControl className={classes.formControl} fullWidth>
				<InputLabel id={'geo-label'}>Location</InputLabel>
				<Input type="text" labelId={'geo-label'} id={'geo-id'}
				       name="geo"/>
			</FormControl>
			{channel.fields.map(prop => (
				<FormControl className={classes.formControl} fullWidth>
					<InputLabel id={prop.key + '-label'}>{prop.name}</InputLabel>
					<Input type="text" labelId={prop.key + '-label'} id={prop.key + '-id'}
					       defaultValue={properties[prop.key]}
					       onChange={onChange} name={prop.key}/>
				</FormControl>
			))}
		</div>
	)
}

export default autoForm;