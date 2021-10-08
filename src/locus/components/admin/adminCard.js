import React from 'react';

import {Link, useHistory, useParams} from "react-router-dom";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import {useStyles} from "themeLocus";


const AdminCard = () => {

	const classes = useStyles();

	return (
		<Card className={classes.root}>
			<CardContent>
				<Typography gutterBottom variant="h5" component="h2">
					foo
				</Typography>
				<Typography variant="body2" color="textSecondary" component="p">
					bar
				</Typography>
			</CardContent>
			<CardActions>

			</CardActions>
		</Card>
	)

};


export default AdminCard;