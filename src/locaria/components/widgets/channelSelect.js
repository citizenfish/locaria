import React from 'react';

import {channels, configs} from 'themeLocaria';
import {useStyles} from "stylesLocaria";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {openSearchDraw} from "../redux/slices/searchDrawSlice";


const ChannelSelect = () => {
	const classes = useStyles();
	const history = useHistory();
	const dispatch = useDispatch()

	return (
			<>
				<Box className={classes.channelCallToAction}
					display="flex"
					flexDirection="column"
					justifyContent="center"
					alignItems="center">
					<Typography variant="body1" component="div" style = {{color: "black"}}>{configs.channelCallToAction}</Typography>
				</Box>
				<Grid container className={classes.root} spacing={2} justifyContent="center">
					{channels.listChannels().map(function (channel) {
							const chan = channels.getChannelProperties(channel);
							if (chan.display !== false) {
								return (
									<Grid item md={configs.homeGrid} className={classes.channel} key={chan.key} onClick={() => {dispatch(openSearchDraw({categories: [channel]}));}}>
										<div className={classes.channelPod}>
											<img src={chan.image}/>
											<Typography gutterBottom variant="h5" component="h2"
														style={{color: `${chan.color}`}}>
												{chan.name}
											</Typography>
											<Typography variant="body2" color="textSecondary" component="p" className={classes.channelDescription}>
												{chan.description}
											</Typography>
											<Button size="medium" color="secondary" variant="outlined" onClick={() => { dispatch(openSearchDraw({categories: [channel]}));}}>
												EXPLORE
											</Button>
										</div>
									</Grid>

								)
							}
						}
					)}
				</Grid>
			</>

	)
}

export default ChannelSelect;