import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import {useStyles} from 'themeLocus';


import Layout from './widgets/layout';
import ChannelSelect from "./widgets/channelSelect";

const Home = () => {
	const classes = useStyles();

	return (
		<Layout map={true}>
			<Paper elevation={3} className={classes.paperMargin}>
				<Grid container className={classes.root} spacing={2} justifyContent="center">
					<ChannelSelect/>
				</Grid>
			</Paper>
		</Layout>
	);
};


export default Home;