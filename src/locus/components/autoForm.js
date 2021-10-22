import React from "react";

import FormControl from "@material-ui/core/FormControl";
import Slider from '@material-ui/core/Slider';
import Typography from "@material-ui/core/Typography";


import {channels, useStyles} from "themeLocus";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";


const autoForm = ({category, properties}) => {
	const classes = useStyles();

	let channel = channels.getChannelProperties(category);


	function onChange(e) {
		properties[e.target.name] = e.target.value;
	}

	return (
		channel.fields.map(prop => (
			<FormControl className={classes.formControl} fullWidth>
				<InputLabel id={prop.key + '-label'}>{prop.name}</InputLabel>
				<Input type="text" labelId={prop.key + '-label'} id={prop.key + '-id'}
				       defaultValue={properties[prop.key]}
				       onChange={onChange} name={prop.key}/>
			</FormControl>
		))
	)
}

export default autoForm;