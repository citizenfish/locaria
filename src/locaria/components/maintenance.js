import React from 'react';

import { configs} from 'themeLocaria';
import {pages} from 'themeLocaria';
import {useStyles} from "stylesLocaria";



import Layout from './widgets/layout';
import {Modal, Paper} from "@mui/material";

const Maintenance = () => {
	const classes = useStyles();

	const pageData=pages.getPageData('Maintenance');
	return (

				<Paper className={classes.maintenance}>
					{pageData}
				</Paper>
	)

};


export default Maintenance;