import React from 'react';
import Paper from '@material-ui/core/Paper';

import {useStyles, configs} from 'themeLocaria';


import Layout from './widgets/layout';
import ChannelSelect from "./widgets/channelSelect";
import ChannelSearch from "./widgets/channelSearch";

const Home = () => {
	const classes = useStyles();
	if (configs.homeMode === 'Search') {
		return (
			<Layout map={true}>
				<Paper elevation={3} className={classes.paperMargin}>
					<ChannelSearch/>
				</Paper>
			</Layout>
		)
	} else {
		return (
			<Layout map={true}>
				<Paper elevation={3} className={classes.paperMargin}>
					<ChannelSelect/>
				</Paper>
			</Layout>
		);
	}
};


export default Home;