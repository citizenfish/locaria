import React from 'react';

import {Link, useHistory, useParams} from "react-router-dom";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import {useStyles} from "stylesLocaria";
import {useCookies} from "react-cookie";
import {Badge} from "@mui/material";


const AdminCard = () => {

	const [cookies, setCookies] = useCookies(['location']);
	const [totals, setTotals] = React.useState(0);

	React.useEffect(() => {

		if (totals === 0) {
			window.websocket.send({
				"queue": "updateTotals",
				"api": "sapi",
				"data": {
					"method": "view_report",
					"id_token": cookies['id_token']
				}
			});
		}
	});


	window.websocket.registerQueue("refreshView", function (json) {
		///.......
		setTotals(0);
	});

	window.websocket.registerQueue("updateTotals", function (json) {
		let totals = json.packet.add_item + json.packet.delete_item + json.packet.update_item;
		setTotals(totals);
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
				<Badge color="secondary" badgeContent={totals}>
					<Button size="small" color="secondary" variant="outlined" onClick={refresh}>Refresh
						view</Button>
				</Badge>
			</CardContent>
			<CardActions>

			</CardActions>
		</Card>
	)


};


export default AdminCard;