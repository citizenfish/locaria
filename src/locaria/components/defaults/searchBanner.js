import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Card from "@mui/material/Card";
import React from "react";
import searchMain from '../../../theme/default/images/main.jpg';
import {useStyles} from 'stylesLocaria';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {useHistory} from "react-router-dom";

const SearchBanner = () => {
	const classes = useStyles();
	const history = useHistory();

	return (
		<Card className={classes.root}>
			<CardMedia
				className={classes.media}
				image={searchMain}
				title={'Search'}
			/>
			<CardContent className={classes.channelPanel}>
				<Typography gutterBottom variant="h5" component="h2">
					The default banner
				</Typography>
				<Typography variant="body2" color="textSecondary" component="p">
					This is a default component, you need to override it with your own version in
					theme/yourtheme/default/searchBanner.js
				</Typography>
			</CardContent>
			<CardActions>
				<Button size="small" color="secondary" variant="outlined" onClick={() => {

					window.location = `https://github.com/nautoguide/locaria_open`;
				}}>
					Link to something
				</Button>
			</CardActions>
		</Card>
	)
}

export default SearchBanner;