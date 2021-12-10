import React from 'react';
import Paper from '@material-ui/core/Paper';

import {useStyles} from 'themeLocaria';


import Layout from './widgets/layout';
import ChannelSelect from "./widgets/channelSelect";

const Home = () => {
	const classes = useStyles();

	return (
		<Layout map={true}>
			<Paper elevation={3} className={classes.paperMargin}>
				<ChannelSelect/>
			</Paper>
		</Layout>
	);
};


export default Home;