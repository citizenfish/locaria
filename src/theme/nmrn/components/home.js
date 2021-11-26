import React from 'react';
import Paper from '@material-ui/core/Paper';

import {useStyles} from 'themeLocus';


import Layout from '../../../locus/components/widgets/layout';
import ChannelSearch from "../../../locus/components/widgets/channelSearch";

const Home = () => {
	const classes = useStyles();

	return (
		<Layout map={true}>
			<Paper elevation={3} className={classes.paperMargin}>
				<ChannelSearch/>
			</Paper>
		</Layout>
	)
		;
};


export default Home;