import React from 'react';

import {channels, configs} from 'themeLocaria';
import {useStyles} from "stylesLocaria";


import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import {useHistory} from "react-router-dom";

const ChannelSelect = () => {
	const classes = useStyles();
	const history = useHistory();

	return (
		<Grid container className={classes.root} spacing={2} justifyContent="center">
			{channels.listChannels().map(function (channel) {
					const chan = channels.getChannelProperties(channel);
					if (chan.display !== false) {
						return (
							<Grid item md={configs.homeGrid} className={classes.channel} key={chan.key}>
								<div className={classes.channelPod}>
								<img src={chan.image}/>
										<Typography gutterBottom variant="h5" component="h2"
										            style={{color: `${chan.color}`}}>
											{chan.name}
										</Typography>
										<Typography variant="body2" color="textSecondary" component="p">
											{chan.description}
										</Typography>
										<Button size="small" color="secondary" variant="outlined" onClick={() => {
											if (chan.type === 'Report' && chan.noCategory !== undefined && chan.noCategory === true) {
												history.push(`/${chan.type}/${channel}/${chan.report_name}`)
											} else {
												history.push(`/Category/${channel}`)

											}
										}}>
											View
										</Button>
								</div>
							</Grid>

						)
					}
				}
			)}
		</Grid>
	)
}

export default ChannelSelect;