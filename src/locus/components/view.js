import React from 'react';

import Layout from './Layout';
import ChannelCard from './channelCard';

import {Link, useParams, BrowserRouter} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {configs, useStyles} from "../../theme/locus";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Openlayers from "../libs/Openlayers";
import LinearProgress from "@material-ui/core/LinearProgress";
import {viewStyle} from "../../theme/mapStyles/view"
import {useCookies} from "react-cookie";

const View = () => {
	let {feature} = useParams();
	let {category} = useParams();
	const classes = useStyles();
	const ol = new Openlayers();
	const [location, setLocation] = useCookies(['location']);


	const [view, setView] = React.useState(null);

	React.useEffect(() => {


		window.websocket.registerQueue("viewLoader", function (json) {
			setView(json);
			ol.addMap({
				"target": "map",
				"projection": "EPSG:3857",
				"renderer": ["canvas"],
				"zoom": 10,
				center: configs.defaultLocation
			});
			ol.addLayer({
				"name": "xyz",
				"type": "xyz",
				"url": `https://api.os.uk/maps/raster/v1/zxy/${configs.OSLayer}/{z}/{x}/{y}.png?key=${configs.OSKey}`,
				"active": true
			});
			ol.addLayer({
				"name": "data",
				"type": "vector",
				"active": true,
				"style": viewStyle
			});
			ol.addGeojson({
				"layer": "data",
				"geojson": {
					"type": "FeatureCollection",
					"features": [
							{
								"geometry": {
									"type": "Point",
									"coordinates": location.location
								},
								"type": "Feature",
								"properties":{
									"type":"location"
								}
							}
						]
				}
			});
			ol.addGeojson({"layer": "data", "geojson": json.packet});
			ol.zoomToLayerExtent({"layer": "data", "buffer": 50});
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
					<Grid item md={4}>
						<Paper elevation={3} className={classes.paperMargin}>
							<ChannelCard path={'/Category/'+category}></ChannelCard>
						</Paper>
					</Grid>
					<Grid item md={8}>
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
										<div id="map" className={classes.mapView}></div>
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
				<LinearProgress/>
			</Layout>
		)
	}

};


export default View;