import React from 'react';
import Paper from '@mui/material/Paper';

import { configs} from 'themeLocaria';
import {useStyles} from "stylesLocaria";



import Layout from './widgets/layout';
import ChannelSelect from "./widgets/channelSelect";
import ChannelSearch from "./widgets/channelSearch";

const Home = () => {
	const classes = useStyles();
	if (configs.homeMode === 'Search') {
		return (
			<Layout map={true} fullscreen={true}>
			{/*	<Paper elevation={3} className={classes.paperMargin}>
					<ChannelSearch/>
				</Paper>*/}
			</Layout>
		)
	} else {
		return (
			<Layout map={true}>
{/*
				<Paper elevation={3} className={classes.paperMargin}>
*/}
					<ChannelSelect/>
{/*
				</Paper>
*/}
			</Layout>
		);
	}
};


export default Home;