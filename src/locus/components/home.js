import React from 'react';
import { Link } from 'react-router-dom';
import { channels } from "../../theme/locus";

import Layout from './Layout';

const Home = () => {
	console.log(channels);
	return (
		<Layout>
			{channels.map(channel => (
				channelDisplay(channel)
			))}
		</Layout>
	);
};

function channelDisplay(channel) {
	if(channel.type==='Report')
		return (<Link to={`/${channel.type}/${channel.report_name}`} key={channel.key}>{channel.description}</Link>)
	else
		return (<Link to={`/${channel.type}/${channel.category}`} key={channel.key}>{channel.description}</Link>)

}

export default Home;