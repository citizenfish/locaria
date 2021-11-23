import React from 'react';

import {channels, useStyles, configs} from 'themeLocus';

import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {useHistory} from "react-router-dom";

const ChannelSearch = () => {
	const classes = useStyles();
	const history = useHistory();

	return (
		channels.listChannels().map(function (channel) {
				const chan = channels.getChannelProperties(channel);
				if (chan.display !== false) {
					return (
						<Grid item md={configs.homeGrid} className={classes.channel} key={chan.key}>
							<Card className={classes.root}>
								<CardMedia
									className={classes.media}
									image={chan.image}
									title={chan.name}
								/>
								<CardContent className={classes.channelPanel}>
									<Typography gutterBottom variant="h5" component="h2"
									            style={{color: `${chan.color}`}}>
										{chan.name}
									</Typography>
									<Typography variant="body2" color="textSecondary" component="p">
										{chan.description}
									</Typography>
								</CardContent>
								<CardActions>
									<Button size="small" color="secondary" variant="outlined" onClick={() => {
										history.push(`/${chan.type}/${channel}`)
									}}>
										View
									</Button>
								</CardActions>
							</Card>
						</Grid>

					)
				}
			}
		)
	)
}

export default ChannelSearch;