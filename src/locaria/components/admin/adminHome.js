import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import {useStyles} from 'stylesLocaria';


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