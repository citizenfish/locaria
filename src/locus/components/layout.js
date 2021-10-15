import React from 'react';

import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import {channels, useStyles, theme, configs} from "themeLocus";
import {ThemeProvider} from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {Link} from "react-router-dom";
import Openlayers from "libs/Openlayers";
import Paper from "@material-ui/core/Paper";
import {useCookies} from 'react-cookie';
import {viewStyle, locationStyle} from "mapStyle";
import Button from "@material-ui/core/Button";
import {useHistory} from 'react-router-dom';
import Box from '@material-ui/core/Box';


const Layout = ({children, map, update}) => {
	const history = useHistory();

	const classes = useStyles();

	const [anchorEl, setAnchorEl] = React.useState(null);
	const [anchorProfileEl, setAnchorProfileEl] = React.useState(null);

	const [openError, setOpenError] = React.useState(false);
	const [openSuccess, setOpenSuccess] = React.useState(false);


	const [cookies, setCookies] = useCookies(['location']);


	const ol = new Openlayers();

	const isMenuOpen = Boolean(anchorEl);
	const isProfileMenuOpen = Boolean(anchorProfileEl);

	const handleMenuOpen = (e) => {
		setAnchorEl(e.currentTarget);
	};


	const handleMenuClose = () => {
		setAnchorEl(null);
		setAnchorProfileEl(null);
	};

	const handleProfileMenuOpen = (e) => {
		setAnchorProfileEl(e.currentTarget);

	}

	const menuId = 'primary-search-account-menu';

	const handleFeatureSelected = function (features) {
		if (features[0].get('geometry_type') === 'cluster') {
			ol.zoomToLayerExtent({"layer": "data", "buffer": 50000, "extent": features[0].get('extent')});

		} else {

			if (features.length === 1) {
				history.push(`/View/${features[0].get('category')}/${features[0].get('fid')}`)
			} else {
				let searchLocation = ol.decodeCoords(features[0].getGeometry().flatCoordinates, 'EPSG:3857', 'EPSG:4326');
				history.push(`Category/${features[0].get('category')}/${searchLocation[0]},${searchLocation[1]}/1`)
			}
		}
	}

	const onZoomChange = (result) => {
		let resolutions = ol.updateResolution();
		let packet = {
			"queue": "homeLoader",
			"api": "api",
			"data": {
				"method": "search",
				"category": configs.homeCategorySearch,
				"bbox": `${result.extent4326[0]} ${result.extent4326[1]},${result.extent4326[2]} ${result.extent4326[3]}`,
				"cluster": resolutions.resolution < configs.clusterCutOff ? false : true,
				"cluster_width": Math.floor(configs.clusterWidthMod * resolutions.resolution)
			}
		};
		window.websocket.send(packet);
	}

	React.useEffect(() => {

		if (map === true) {

			ol.addMap({
				"target": "map",
				"projection": "EPSG:3857",
				"renderer": ["canvas"],
				"zoom": configs.defaultZoom,
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
			if (configs.cluster === true) {
				ol.addResolutionEvent({"changeFunction": onZoomChange});
			} else {
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

			ol.addLayer({
				"name": "location",
				"type": "vector",
				"active": true,
				"style": locationStyle
			});
			ol.makeControl({"layers": ["data"], "selectedFunction": handleFeatureSelected, "multi": true});


			if (cookies.location) {
				ol.flyTo({"coordinate": cookies.location, "projection": "EPSG:4326"});
				ol.addGeojson({
					"layer": "location",
					"geojson": {
						"type": "FeatureCollection",
						"features": [
							{
								"geometry": {
									"type": "Point",
									"coordinates": cookies.location
								},
								"type": "Feature",
								"properties": {}
							}
						]
					}
				});

			} else {
				console.log('no location');
			}

		}


		window.websocket.registerQueue("homeLoader", function (json) {
			if (map === true) {

				ol.addGeojson({"layer": "data", "geojson": json.packet, "clear": true});
			}
		});


	}, []);

	window.websocket.registerQueue("postcode", function (json) {
		if (json.packet.features.length > 0) {
			let postcode = document.getElementById('myPostcode').value;
			setCookies('location', json.packet.features[0].geometry.coordinates, {path: '/', sameSite: true});
			setCookies('postcode', postcode, {path: '/', sameSite: true});

			if (map === true) {
				ol.clearLayer({"layer": "location"});
				ol.addGeojson({
					"layer": "location",
					"geojson": {
						"type": "FeatureCollection",
						"features": [
							{
								"geometry": {
									"type": "Point",
									"coordinates": json.packet.features[0].geometry.coordinates
								},
								"type": "Feature",
								"properties": {}
							}
						]
					}
				});
				ol.flyTo({"coordinate": json.packet.features[0].geometry.coordinates, "projection": "EPSG:4326"});
			}
			setOpenSuccess(true);
			if (update !== undefined)
				update();


		} else {
			setOpenError(true);
		}
	});

	function closeError() {
		setOpenError(false);
	}

	function closeSuccess() {
		setOpenSuccess(false);
	}

	function handleKeyDown(e) {
		if (e.key === 'Enter') {
			let postcode = document.getElementById('myPostcode').value;
			postcode = postcode.toUpperCase();
			document.getElementById('myPostcode').value = postcode;

			window.websocket.send({
				"queue": "postcode",
				"api": "api",
				"data": {
					"method": "address_search",
					"address": postcode
				}
			});

		}

	}

	function channelDisplay(channel) {
		if (channel.type === 'Report')
			return (<MenuItem component={Link} to={`/${channel.type}/${channel.report_name}`} key={channel.key}
			                  content={channel.name}>{channel.name}</MenuItem>)
		else
			return (<MenuItem component={Link} to={`/${channel.type}/${channel.key}`} key={channel.key}
			                  content={channel.name}>{channel.name}</MenuItem>)

	}

	function resetMap() {
		ol.flyTo({"coordinate": cookies.location, "projection": "EPSG:4326", "zoom": configs.defaultZoom});
	}

	const renderMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{vertical: 'top', horizontal: 'right'}}
			id={menuId}
			keepMounted
			transformOrigin={{vertical: 'top', horizontal: 'right'}}
			open={isMenuOpen}
			onClose={handleMenuClose}
		>
			<MenuItem component={Link} to={`/`}>Home</MenuItem>
			{channels.listChannels().map(function (channel) {
				if (channels.displayChannel(channel))
					return channelDisplay(channels.getChannelProperties(channel));
			})}
		</Menu>
	);

	const handleLogin = function () {
		handleMenuClose();
		window.location = `https://${configs.cognitoURL}/login?response_type=token&client_id=${configs.cognitoPoolId}&redirect_uri=http://localhost:8080/`;
	}

	const handleSignup = function () {
		handleMenuClose();
		window.location = `https://${configs.cognitoURL}/signup?response_type=token&client_id=${configs.cognitoPoolId}&redirect_uri=http://localhost:8080/`;
	}

	const handleLogout = function () {
		handleMenuClose();
		setCookies('id_token', "null", {path: '/', sameSite: true});
		window.location = `/`;
	}

	const handleAdmin = function () {
		handleMenuClose();
		window.location = `/Admin/`;

	}

	function renderProfileMenu() {
		if (cookies['id_token'] === undefined || cookies['id_token'] === "null") {
			return (
				<Menu
					anchorEl={anchorProfileEl}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					id={menuId}
					keepMounted
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					open={isProfileMenuOpen}
					onClose={handleMenuClose}
				>
					<MenuItem onClick={handleLogin}>Login</MenuItem>
					<MenuItem onClick={handleSignup}>Signup</MenuItem>
				</Menu>
			)
		} else {
			return (
				<Menu
					anchorEl={anchorProfileEl}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					id={menuId}
					keepMounted
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					open={isProfileMenuOpen}
					onClose={handleMenuClose}
				>
					<MenuItem onClick={handleLogout}>Logout</MenuItem>
					{cookies.groups.indexOf('Admins') !== -1 ?
						<MenuItem component={Link} to={`/Admin/`} key="adminLink">Admin</MenuItem> : ''}
				</Menu>
			)
		}
	};


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

				<div className={classes.grow}>
					<AppBar position="static">
						<Toolbar>
							<IconButton
								edge="start"
								className={classes.menuButton}
								color="inherit"
								aria-label="open drawer"
								onClick={handleMenuOpen}
							>
								<MenuIcon/>
							</IconButton>
							<Typography className={classes.title} variant="h6" noWrap>
								{configs.siteTitle}
							</Typography>
							<div className={classes.search}>
								<div className={classes.searchIcon}>
									<SearchIcon/>
								</div>
								<InputBase
									placeholder="Postcode…"
									classes={{
										root: classes.inputRoot,
										input: classes.inputInput,
									}}
									inputProps={{'aria-label': 'search'}}
									defaultValue={cookies.postcode ? cookies.postcode : configs.defaultPostcode}
									onKeyPress={handleKeyDown}
									id="myPostcode"
								/>
							</div>
							<Box sx={{flexGrow: 1}}/>
							<Box sx={{display: {xs: 'none', md: 'flex'}}}>
								<IconButton
									size="large"
									edge="end"
									aria-label="account of current user"
									aria-controls={menuId}
									aria-haspopup="true"
									onClick={handleProfileMenuOpen}
									color="inherit"
								>
									<AccountCircle/>
								</IconButton>
							</Box>
						</Toolbar>
					</AppBar>
					{renderMenu}
					{renderProfileMenu()}
				</div>
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
						<div id="map" className={classes.map}>
							<Button className={classes.mapResetButton} onClick={resetMap} color="secondary"
							        variant="outlined">Reset map</Button>
						</div>
					</div>
				</Paper>
			)
		}
	}
};


export default Layout;
