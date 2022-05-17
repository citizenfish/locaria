import React from 'react';

import { configs} from 'themeLocaria';
import {useStyles} from "stylesLocaria";



import Layout from './widgets/layout';
import {Modal, Paper} from "@mui/material";

const Maintenance = () => {
	const classes = useStyles();

	return (

				<Paper className={classes.maintenance}>
					<h1>Site Maintenance</h1>
				</Paper>
	)

};


export default Maintenance;