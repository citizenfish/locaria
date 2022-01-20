import React from 'react';

import { configs} from 'themeLocaria';



import Layout from './widgets/layout';
import ChannelSelect from "./widgets/channelSelect";

const Home = () => {
	if (configs.homeMode === 'Search') {
		return (
			<Layout map={true} fullscreen={true}>
			</Layout>
		)
	} else {
		return (
			<Layout map={true}>
				<ChannelSelect/>
			</Layout>
		);
	}
};


export default Home;