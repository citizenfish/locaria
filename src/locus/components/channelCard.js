import React from 'react';

import {Link, useParams} from "react-router-dom";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import {channels, useStyles} from "../../theme/locus";

const ChannelCard = ({path}) => {
	const classes = useStyles();
	let {category} = useParams();
	let channel;
	for(let c in channels) {
		if(channels[c].key===category)
			channel=channels[c];
	}
	return (
		<Card className={classes.root}>
			<CardActionArea>
				<CardMedia
					className={classes.media}
					image={channel.image}
					title={channel.name}
				/>
				<CardContent>
					<Typography gutterBottom variant="h5" component="h2">
						{channel.name}
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						{channel.description}
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions>
				<Link to={path}>
					<Button size="small" color="primary">
						Back
					</Button>
				</Link>

			</CardActions>
		</Card>
	)

};


export default ChannelCard;