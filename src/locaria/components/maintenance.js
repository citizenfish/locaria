import React from 'react';

import {useStyles} from "stylesLocaria";



import { Paper} from "@mui/material";

const Maintenance = () => {
	const classes = useStyles();

	return (

				<Paper className={classes.maintenance}>
					<h1>Site Maintenance</h1>
				</Paper>
	)

};


export default Maintenance;