import React, {useRef} from 'react';

import Container from '@material-ui/core/Container';
import {useStyles, theme, configs, channels} from "themeLocus";
import {ThemeProvider} from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Paper from "@material-ui/core/Paper";
import {useCookies} from 'react-cookie';
import {useHistory} from 'react-router-dom';
import Map from "./map";
import TopNav from "./topNav";


const Layout = ({children, map, update}) => {
	const history = useHistory();
	const mapRef = useRef();

	const classes = useStyles();


	const [openError, setOpenError] = React.useState(false);
	const [openSuccess, setOpenSuccess] = React.useState(false);


	const [cookies, setCookies] = useCookies(['location']);


	const handleFeatureSelected = function (features) {
		if (features[0].get('geometry_type') === 'cluster') {
			mapRef.current.zoomToExtent(features[0].get('extent'));
		} else {
			let channel = channels.getChannelProperties(features[0].get('category'));
			if (channel.type === "Report") {
				// can only handle one feature
				history.push(`/Report/${features[0].get('category')}/${channel.reportId}/${features[0].get('fid')}`);
			} else {
				if (features.length === 1) {
					history.push(`/View/${features[0].get('category')}/${features[0].get('fid')}`)
				} else {
					let searchLocation = mapRef.current.decodeCoords(features[0].getGeometry().flatCoordinates);
					history.push(`Category/${features[0].get('category')}/${searchLocation[0]},${searchLocation[1]}/1`)
				}
			}
		}
	}

	const onZoomChange = (resolutions) => {
		let packet = {
			"queue": "homeLoader",
			"api": "api",
			"data": {
				"method": "search",
				"category": configs.homeCategorySearch,
				"bbox": `${resolutions.extent4326[0]} ${resolutions.extent4326[1]},${resolutions.extent4326[2]} ${resolutions.extent4326[3]}`,
				"cluster": resolutions.resolution < configs.clusterCutOff ? false : true,
				"cluster_width": Math.floor(configs.clusterWidthMod * resolutions.resolution)
			}
		};
		window.websocket.send(packet);
	}

	React.useEffect(() => {

		if (map === true) {
			if (configs.cluster === undefined || configs.cluster === false) {
				window.websocket.send({
					"queue": "homeLoader",
					"api": "api",
					"data": {
						"method": "search",
						"category": "Events",
						"location": `SRID=4326;POINT(${cookies.location[0]} ${cookies.location[1]})`,
						"location_distance": 5000000000,
						"cluster": false
					}
				});
			}

			if (cookies.location) {
				mapRef.current.markHome(cookies.location)
			} else {
				console.log('no location');
			}

		}


		window.websocket.registerQueue("homeLoader", function (json) {
			if (map === true) {
				mapRef.current.addGeojson(json.packet)
			}
		});

		window.websocket.registerQueue("postcode", function (json) {
			if (json.packet.features.length > 0) {
				let postcode = document.getElementById('myPostcode').value;
				setCookies('location', json.packet.features[0].geometry.coordinates, {path: '/', sameSite: true});
				setCookies('postcode', postcode, {path: '/', sameSite: true});

				if (map === true) {
					mapRef.current.markHome(json.packet.features[0].geometry.coordinates);
				}
				setOpenSuccess(true);
				if (update !== undefined)
					update();


			} else {
				setOpenError(true);
			}
		});

		return () => {
			window.websocket.clearQueues();
		}

	}, [map]);


	function closeError() {
		setOpenError(false);
	}

	function closeSuccess() {
		setOpenSuccess(false);
	}


	return (
		<ThemeProvider theme={theme}>
			<Snackbar open={openError} autoHideDuration={3000} onClose={closeError}
			          anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
				<Alert severity="error">
					Postcode not found — <strong>try another!</strong>
				</Alert>
			</Snackbar>

			<Snackbar open={openSuccess} autoHideDuration={2000} onClose={closeSuccess}
			          anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
				<Alert severity="success">
					Found your location
				</Alert>
			</Snackbar>
			<Container>
				<TopNav></TopNav>
				<div>
					{displayMap()}

					{children}


				</div>

			</Container>
		</ThemeProvider>
	);

	function displayMap() {
		if (map === true) {
			return (
				<Paper elevation={3} className={classes.paperMargin}>
					<div className={classes.mapContainer}>
						<Map ref={mapRef} onFeatureSeleted={handleFeatureSelected}
						     onZoomChange={configs.cluster ? onZoomChange : undefined}/>
					</div>
				</Paper>
			)
		}
	}
};


export default Layout;
