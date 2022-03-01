import React from 'react';

import { configs} from 'themeLocaria';
import {useStyles} from "stylesLocaria";
import ChannelSelect from "./widgets/channelSelect";



const Landing = () => {
		return (
			<>
				<h1>Landing</h1>
				<ChannelSelect></ChannelSelect>
			</>
		)
};


export default Landing;