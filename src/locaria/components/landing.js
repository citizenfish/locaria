import React from 'react';

import { configs} from 'themeLocaria';
import {useStyles} from "stylesLocaria";
import ChannelSelect from "./widgets/channelSelect";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {Box} from "@mui/material";




const Landing = () => {
	const classes = useStyles();

	return (
			<>
				<AppBar position={'static'}>
					<Toolbar>
						<Typography variant="h6" component="div">
							{configs.siteTitle}
						</Typography>
					</Toolbar>
				</AppBar>
				<Box className={classes.landingCallToAction}
				     display="flex"
				     flexDirection="column"
				     justifyContent="center"
				     alignItems="center">
					<Typography variant="h6" component="div">
						{configs.siteCallToAction}
					</Typography>
				</Box>
				<ChannelSelect></ChannelSelect>
			</>
		)
};


export default Landing;