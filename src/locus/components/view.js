import React from 'react';

import Layout from './widgets/layout';
import Share from './widgets/share';
import Linker from './widgets/linker';
import ChannelCard from './widgets/channelCard';

import {Link, useParams, BrowserRouter, useHistory} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {channels, configs, useStyles} from "themeLocus";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Openlayers from "libs/Openlayers";
import LinearProgress from "@material-ui/core/LinearProgress";
import {viewStyle} from "./mapStyles/view"
import {useCookies} from "react-cookie";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";

const View = () => {
	let {feature} = useParams();
	let {category} = useParams();
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


	}, [view]);

	window.websocket.registerQueue("viewLoader", function (json) {
		if (json.packet.response_code !== 200) {
			setView({});
		} else {
			setView(json.packet);
		}
	});

	function resetMap() {
		ol.zoomToLayerExtent({"layer": "data", "buffer": 50000});
	}

	const handleAdminView = function () {
		window.location = `/AdminView/${feature}`;
	}

	if (view !== null) {
		if (view.features === undefined) {
			return (
				<Layout update={handleNewLocation}>
					<Grid container className={classes.root} spacing={6}>
						<Grid item md={4}>
							<Paper elevation={3} className={classes.paperMargin}>
								<ChannelCard path={'/Category/' + category}></ChannelCard>
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
											It may have been removed from the system
										</Typography>
									</CardContent>
								</Card>

							</Paper>
						</Grid>
					</Grid>
				</Layout>
			)
		} else {
			return (
				<Layout update={handleNewLocation}>
					<Grid container className={classes.root} spacing={6}>
						<Grid item md={4}>
							<Paper elevation={3} className={classes.paperMargin}>
								<ChannelCard path={'/Category/' + category}></ChannelCard>
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

										<Typography variant="h5" component="h2" className={classes.viewTitle}>
											{view.features[0].properties.description.title}
										</Typography>

										{view.features[0].properties.tags.map(tag => (
											<Chip label={tag} variant="outlined"
											      style={{"background-color": `${channels.getChannelColor(category, tag)}`}}
											      className={classes.tags}/>
										))}

										<Typography variant="h5" component="h2" className={classes.viewSection}>
											What it is:
										</Typography>
										<Typography variant="body2" color="textSecondary" component="p">
											{view.features[0].properties.description.text}
										</Typography>

										{view.features[0].properties.description.primary_age_group ? (
											<div>
												<Typography variant="h5" component="h2" className={classes.viewSection}>
													Who it's for:
												</Typography>
												<Typography variant="body2" color="textSecondary" component="p">
													{view.features[0].properties.description.primary_age_group}
												</Typography>
											</div>
										) : ''}

										{view.features[0].properties.description.street || view.features[0].properties.description.borough || view.features[0].properties.description.postcode ? (
											<div>
												<Typography variant="h5" component="h2" className={classes.viewSection}>
													Where you can find it:
												</Typography>
												<Typography variant="body2" color="textSecondary" component="p">
													{view.features[0].properties.description.street}
												</Typography>
												<Typography variant="body2" color="textSecondary" component="p">
													{view.features[0].properties.description.borough}
												</Typography>
												<Typography variant="body2" color="textSecondary" component="p">
													{view.features[0].properties.description.postcode}
												</Typography>
											</div>
										) : ''}

										{view.features[0].properties.description.email ? (
											<div>
												<Typography variant="h5" component="h2" className={classes.viewSection}>
													Who to contact:
												</Typography>
												<Typography variant="body2" color="textSecondary" component="p">
													{view.features[0].properties.description.email}
												</Typography>
											</div>
										) : ''}


									</CardContent>
									<CardActions>
										<OutsideLink to={view.features[0].properties.description.url}></OutsideLink>
										<Share></Share>
										{cookies.groups.indexOf('Admins') !== -1 ?
											<Button size="small" color="secondary"
											        variant="outlined" onClick={() => {
												history.push(`/AdminView/${feature}`)
											}}>Edit</Button> : ''}
									</CardActions>
								</Card>

							</Paper>
						</Grid>
					</Grid>
				</Layout>
			);
		}
	} else {
		return (
			<Layout update={handleNewLocation}>
				<LinearProgress/>
			</Layout>
		)
	}

};

const OutsideLink = ({to}) => {
	if (to !== undefined) {
		return (
			<Linker location={to}></Linker>
		)
	} else {
		return '';
	}
}


export default View;