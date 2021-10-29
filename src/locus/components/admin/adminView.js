import React from 'react';

import AdminLayout from './adminLayout';

import {Link, useParams, BrowserRouter, useHistory} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
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
import SearchTags from "../search/SearchTags";
import {channels, configs, useStyles} from "themeLocus";


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
			reload();
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
		if (json.code !== 200) {
			setView({});
		} else {
			setView(json.packet);
		}
	});

	window.websocket.registerQueue("saveFeature", function (json) {
		setView(null);
	});

	window.websocket.registerQueue("deleteFeature", function (json) {
		history.push("/Admin");
	});


	window.websocket.registerQueue("homeView", function (json) {
		history.push("/Admin");
	});

	function reload() {
		window.websocket.send({
			"queue": "viewLoader",
			"api": "api",
			"data": {"method": "get_item", "fid": feature, "live": true}
		});
	}

	function resetMap() {
		ol.zoomToLayerExtent({"layer": "data", "buffer": 50000});
	}

	function saveFeature() {
		window.websocket.send({
			"queue": "saveFeature",
			"api": "sapi",
			"data": {
				"method": "update_item", "fid": feature, "attributes": {
					"description": view.features[0].properties.description,
					"tags": view.features[0].properties.tags
				},
				"id_token": cookies['id_token']
			}
		});

	}

	function deleteFeature() {
		window.websocket.send({
			"queue": "deleteFeature",
			"api": "sapi",
			"data": {
				"method": "delete_item", "fid": feature,
				"id_token": cookies['id_token']
			}
		});

	}

	const historyBack = () => {
		history.goBack();
	}

	function onChange(e) {
		view.features[0].properties.description[e.target.name] = e.target.value;
	}

	function onChangeTags(newTags) {
		//debugger;
		console.log(newTags);
		view.features[0].properties.tags = newTags;
	}


	function editFields() {
		let channel = channels.getChannelProperties(view.features[0].properties.category);
		if (channel.fields) {
			return (
				channel.fields.map(prop => (
					<FormControl className={classes.formControl} fullWidth>
						<InputLabel id={prop.key + '-label'}>{prop.name}</InputLabel>
						<Input type="text" labelId={prop.key + '-label'} id={prop.key + '-id'}
						       defaultValue={view.features[0].properties.description[prop.key]}
						       onChange={onChange} name={prop.key}/>
					</FormControl>
				))
			)
		} else {
			// No channel config so we just display what we got
			return (
				Object.keys(view.features[0].properties.description).map(prop => (
					<FormControl className={classes.formControl} fullWidth>
						<InputLabel id={prop + '-label'}>{prop}</InputLabel>
						<Input type="text" labelId={prop + '-label'} id={prop + '-id'}
						       defaultValue={view.features[0].properties.description[prop]}
						       onChange={onChange} name={prop}/>
					</FormControl>
				))
			)
		}

	}

	if (view !== null) {
		if (view.features === undefined) {
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
										<Typography variant="h5" component="h2" className={classes.viewTitle}>
											Feature not found
										</Typography>
										<Typography variant="body2" color="textSecondary" component="p">
											It may have been deleted but the view has not been
											refreshed
										</Typography>
									</CardContent>
									<CardActions>
										<Button size="small" color="secondary" onClick={historyBack} variant="outlined">
											Back
										</Button>
									</CardActions>
								</Card>

							</Paper>
						</Grid>
					</Grid>
				</AdminLayout>)
		} else {
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

										<SearchTags category={view.features[0].properties.category[0]}
										            changeFunction={onChangeTags}
										            currentValue={view.features[0].properties.tags}></SearchTags>


										{editFields()}

									</CardContent>
									<CardActions>
										<Button size="small" color="secondary" onClick={saveFeature} variant="outlined">
											Save
										</Button>
										<Button size="small" color="secondary" onClick={deleteFeature}
										        variant="outlined">
											Delete
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
		}
	} else {
		return (
			<AdminLayout>
				<LinearProgress/>
			</AdminLayout>
		)
	}

};


export default AdminView;