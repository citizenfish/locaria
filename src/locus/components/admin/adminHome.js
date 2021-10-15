import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import {useStyles} from 'themeLocus';


import AdminLayout from './adminLayout';

const AdminHome = () => {
	const classes = useStyles();

	return (
		<AdminLayout>
			<Paper elevation={3} className={classes.paperMargin}>
				<Grid container className={classes.root} spacing={2} justifyContent="center">
					<h1>Admin home</h1>
				</Grid>
			</Paper>
		</AdminLayout>
	);
};


export default AdminHome;