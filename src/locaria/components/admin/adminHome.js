import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import {useStyles} from 'themeLocus';


import AdminLayout from './adminLayout';
import AdminCard from "./adminCard";

const AdminHome = () => {
	const classes = useStyles();

	return (
		<AdminLayout>
			<Grid container className={classes.root} spacing={6}>
				<Grid item md={4}>
					<Paper elevation={3} className={classes.paperMargin}>
						<AdminCard></AdminCard>
					</Paper>
				</Grid>
				<Grid item md={8}>
					<Paper elevation={3} className={classes.paperMargin}>
						<Grid container className={classes.root} spacing={2} justifyContent="center">
							<h1>Admin home</h1>
						</Grid>
					</Paper>
				</Grid>
			</Grid>
		</AdminLayout>
	);
};


export default AdminHome;