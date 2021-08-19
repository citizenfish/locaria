import React from 'react';

import Layout from './Layout';
import ChannelCard from './channelCard';

import {Link, useParams,BrowserRouter} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {useStyles} from "../../theme/locus";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Openlayers from "../libs/Openlayers";


const View = () => {
	let {feature} = useParams();
	let {category} = useParams();
	const classes = useStyles();

	const [view, setView] = React.useState(null);

	React.useEffect(() => {


		window.websocket.registerQueue("viewLoader",function(json) {
			setView(json);
			const ol=new Openlayers();
			ol.addMap({"target":"map","projection":"EPSG:3857","renderer":["canvas"],"zoom":10,center:[-447255.32888684,7332420.40741905]});
			ol.addLayer({"name":"xyz","type":"xyz","url":"https://api.os.uk/maps/raster/v1/zxy/Light_3857/{z}/{x}/{y}.png?key=w69znUGxB6IW5FXkFMH5LQovdZxZP7jv","active":true});

		});

		window.websocket.send({
			"queue": "viewLoader",
			"api": "api",
			"data": {"method": "get_item", "fid": feature}
		});

	}, []);

	if (view !== null) {
		return (
			<Layout>
				<Grid container className={classes.root} spacing={6}>
					<Grid item xs={4}>
						<Paper elevation={3} className={classes.paperMargin}>
							<ChannelCard></ChannelCard>
						</Paper>
					</Grid>
					<Grid item xs={8}>
						<Paper elevation={3} className={classes.paperMargin}>
							<Card className={classes.root}>
									<CardContent>
										<Typography gutterBottom variant="h5" component="h2">
											{view.packet.features[0].properties.title}
										</Typography>
										<CardMedia
											className={classes.media}
											title={view.packet.features[0].properties.title}
										>
											<div id="map" className={classes.map}></div>
										</CardMedia>

										<Typography variant="body2" color="textSecondary" component="p">
											{view.packet.features[0].properties.description.text}
										</Typography>
									</CardContent>
								<CardActions>
										<Button size="small" color="primary">
											Share
										</Button>

								</CardActions>
							</Card>

						</Paper>
					</Grid>
				</Grid>
			</Layout>
		);
	} else {
		return (
			<Layout>
				<p>Loading</p>
			</Layout>
		)
	}

};


export default View;