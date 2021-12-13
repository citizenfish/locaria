import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Card from "@material-ui/core/Card";
import React from "react";
import searchMain from '../../../theme/default/images/main.jpg';
import {useStyles} from 'themeLocaria';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
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