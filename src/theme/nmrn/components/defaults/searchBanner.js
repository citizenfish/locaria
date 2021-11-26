import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Card from "@material-ui/core/Card";
import React from "react";
import searchMain from '../../images/main.jpg';
import {useStyles} from 'themeLocus';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {useHistory} from "react-router-dom";

const SearchBanner = () => {
	const classes = useStyles();
	const history = useHistory();

	return (
		<Card className={classes.root}>
			<CardMedia
				className={classes.nmrnBannerImage}
				image={searchMain}
				title={'Search'}
			/>
			<CardContent className={classes.channelPanel}>
				<Typography gutterBottom variant="h5" component="h2">
					FIND YOUR RELATIVE
				</Typography>
				<Typography variant="body2" color="textSecondary" component="p">
					Explore the map and find your connection
				</Typography>
			</CardContent>
			<CardActions>
				<Button size="small" color="secondary" variant="outlined" onClick={() => {

					window.location = `https://github.com/nautoguide/locus_open`;
				}}>
					Link to something
				</Button>
			</CardActions>
		</Card>
	)
}

export default SearchBanner;