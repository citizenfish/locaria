import React from 'react';

import {Link, useHistory, useParams} from "react-router-dom";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import {channels} from "themeLocaria";
import {useStyles} from "stylesLocaria";

import Share from "./share";


const ChannelCard = ({path}) => {
	const history = useHistory();

	const classes = useStyles();
	let {category} = useParams();
	let channel = channels.getChannelProperties(category);

	const historyBack = () => {
		history.goBack();
	}

	const submitFeature = () => {
		history.push(`/Submit/${category}`);

	}

	return (
		<Card className={classes.root}>
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
			<CardActions>
				<Share></Share>
				<Button size="small" color="secondary" onClick={historyBack} variant="outlined">
					Back
				</Button>
				{channel.submit ?
					<Button size="small" color="secondary" onClick={submitFeature} variant="outlined">
						Submit
					</Button> : ''}

			</CardActions>
		</Card>
	)

};


export default ChannelCard;