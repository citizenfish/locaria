import React from 'react';

import {Link, useHistory, useParams} from "react-router-dom";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import {useStyles} from "themeLocus";
import {useCookies} from "react-cookie";


const AdminCard = () => {

	const [cookies, setCookies] = useCookies(['location']);

	window.websocket.registerQueue("refreshView", function (json) {
		///.......
	});

	function refresh() {
		window.websocket.send({
			"queue": "refreshView",
			"api": "sapi",
			"data": {
				"method": "refresh_search_view",
				"id_token": cookies['id_token']
			}
		});
	}

	const classes = useStyles();

	return (
		<Card className={classes.root}>
			<CardContent>
				<Button size="small" color="secondary" variant="outlined" onClick={refresh}>Refresh view</Button>
			</CardContent>
			<CardActions>

			</CardActions>
		</Card>
	)

};


export default AdminCard;