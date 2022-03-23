import React from 'react';

import {channels, configs} from 'themeLocaria';
import {useStyles} from "stylesLocaria";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {openSearchDraw} from "../redux/slices/searchDrawSlice";

const ChannelSelect = () => {
	const classes = useStyles();
	const history = useHistory();
	const dispatch = useDispatch()

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
										<Button size="medium" color="secondary" variant="outlined" onClick={() => {
												//history.push(`/Search/["${channel}"]/`)
											dispatch(openSearchDraw({categories: [channel]}));

										}}>
											EXPLORE
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