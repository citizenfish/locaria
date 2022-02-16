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
		<Layout map={true} fullscreen={true}>
			<Modal open={true}>
				<Paper className={classes.maintenance}>
					{pageData}
				</Paper>
			</Modal>
		</Layout>
	)

};


export default Maintenance;