import React from 'react';

import AdminLayout from './adminLayout';

import {Link, useParams, BrowserRouter, useHistory} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {channels, configs, useStyles} from "themeLocus";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Openlayers from "libs/Openlayers";
import LinearProgress from "@material-ui/core/LinearProgress";
import {viewStyle} from "../mapStyles/view"
import {useCookies} from "react-cookie";
import Chip from "@material-ui/core/Chip";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import AdminCard from "./adminCard";

const AdminView = () => {
	let {feature} = useParams();
	const classes = useStyles();
	const ol = new Openlayers();
	const [cookies, setCookies] = useCookies(['location']);

	const history = useHistory();

	const [view, setView] = React.useState(null);


	const handleNewLocation = () => {
		setView(null);
	}

	React.useEffect(() => {

		if (view === null) {
			window.websocket.send({
				"queue": "viewLoader",
				"api": "api",
				"data": {"method": "get_item", "fid": feature}
			});
		} else {
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
								"coordinates": cookies.location
							},
							"type": "Feature",
							"properties": {
								"category": "location",
								"description": {
									"type": "small"
								}
							}
						}
					]
				}
			});
			ol.addGeojson({"layer": "data", "geojson": view});
			ol.zoomToLayerExtent({"layer": "data", "buffer": 50000});
		}


	});

	window.websocket.registerQueue("viewLoader", function (json) {
		setView(json.packet);
	});

	function resetMap() {
		ol.zoomToLayerExtent({"layer": "data", "buffer": 50000});
	}

	function saveFeature() {
		window.websocket.send({
			"queue": "saveFeature",
			"api": "sapi",
			"data": {
				"method": "update_item", "fid": feature, "attributes": {
					"foo": "baa"
				},
				"id_token": cookies['id_token']
			}
		});

	}

	const historyBack = () => {
		history.goBack();
	}

	if (view !== null) {
		return (
			<AdminLayout>
				<Grid container className={classes.root} spacing={6}>
					<Grid item md={4}>
						<Paper elevation={3} className={classes.paperMargin}>
							<AdminCard></AdminCard>
						</Paper>
					</Grid>
					<Grid item md={8}>
						<Paper elevation={3} className={classes.paperMargin}>
							<Card className={classes.root}>
								<CardContent>

									<CardMedia
										className={classes.mediaMap}
										title={view.features[0].properties.description.title}
									>
										<div id="map" className={classes.mapView}>
											<Button className={classes.mapResetButton} onClick={() => {
												resetMap()
											}} color="secondary" variant="outlined">Reset map</Button>
										</div>
									</CardMedia>


									{Object.keys(view.features[0].properties).map(prop => (
										<FormControl className={classes.formControl} fullWidth>
											<InputLabel id="{prop}-label">{prop}</InputLabel>
											<Input value={view.features[0].properties[prop]}/>
										</FormControl>
									))}


								</CardContent>
								<CardActions>
									<Button size="small" color="secondary" onClick={saveFeature} variant="outlined">
										Save
									</Button>

									<Button size="small" color="secondary" onClick={historyBack} variant="outlined">
										Back
									</Button>
								</CardActions>
							</Card>

						</Paper>
					</Grid>
				</Grid>
			</AdminLayout>
		);
	} else {
		return (
			<AdminLayout>
				<LinearProgress/>
			</AdminLayout>
		)
	}

};


export default AdminView;