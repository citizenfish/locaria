import React, {useRef} from 'react';

import Container from '@mui/material/Container';
import {configs, channels, pages} from "themeLocaria";
import {useStyles} from "stylesLocaria";

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {useCookies} from 'react-cookie';
import {Link, useHistory, useLocation, useParams} from 'react-router-dom';
import Map from "./map";
import {IntroModal} from "./intro";
import {
	BottomNavigation,
	BottomNavigationAction,
	Divider,
	Drawer,
	ListItem,
	ListItemIcon,
	ListItemText
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import {NavProfile} from "./navProfile";
import {SearchDraw} from "./draws/searchDraw";
import {ViewDraw} from "./draws/viewDraw";
import CategoryDraw from "./draws/categoryDraw";
import Box from "@mui/material/Box";
import HomeIcon from "@mui/icons-material/Home";
import Multi from "./multi";

import { useSelector, useDispatch } from 'react-redux'
import { openCategoryDraw } from '../redux/slices/categoryDrawSlice'
import { openSearchDraw ,toggleSearchDraw} from '../redux/slices/searchDrawSlice'
import { openViewDraw} from '../redux/slices/viewDrawSlice'
import { openMultiSelect} from '../redux/slices/multiSelectSlice'

const Layout = ({children, map, update, fullscreen = false}) => {
	const mapRef = useRef();
	const location = useLocation();
	let {feature} = useParams();
	const classes = useStyles();

	const dispatch = useDispatch()


	const [leftDraw, setLeftDraw] = React.useState(false);
	const [openError, setOpenError] = React.useState(false);
	const [openSuccess, setOpenSuccess] = React.useState(false);
	const [resolutions, setResolutions] = React.useState(undefined);
	const viewDrawOpen = useSelector((state) => state.viewDraw.open);


	const [cookies, setCookies] = useCookies(['location']);


	const handleFeatureSelected = function (features,geojsonFeatures) {
		if (features[0].get('geometry_type') === 'cluster') {
			mapRef.current.zoomToExtent(features[0].get('extent'));
		} else {
			if(features.length>1)  {
				dispatch(openMultiSelect(geojsonFeatures.features));
			} else {
				dispatch(openViewDraw(features[0].get('fid')));
			}
		}
	}

	const forceMapRefresh = () => {
		if(resolutions!==undefined&&viewDrawOpen===false) {
			updateMap(resolutions);
			console.log('Forced refresh');

		}
	}

	const onZoomChange = (newRes) => {
		console.log('Zoom refresh');
		setResolutions(newRes);
	}
	React.useEffect(() => {
		if (resolutions !== undefined && location.pathname !== '/Search/' && feature==undefined) {
			updateMap(resolutions);
		}

	}, [resolutions]);

	const updateMap = (newRes) => {
		let packet = {
			"queue": "homeLoader",
			"api": "api",
			"data": {
				"method": "search",
				"category": configs.homeCategorySearch,
				"bbox": `${newRes.extent4326[0]} ${newRes.extent4326[1]},${newRes.extent4326[2]} ${newRes.extent4326[3]}`,
				"cluster": newRes.resolution >= configs.clusterCutOff,
				"cluster_width": Math.floor(configs.clusterWidthMod * newRes.resolution)
			}
		};
		window.websocket.send(packet);
	}


	React.useEffect(() => {

		if (location.pathname.match('^/Search/.*')) {
			dispatch(openSearchDraw());

		}
		if (feature) {
			dispatch(openViewDraw(feature));

		}

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

			if (cookies.location && configs.navShowHome !== false) {
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
			window.websocket.removeQueue("postcode");
			window.websocket.removeQueue("homeLoader");
		}

	}, [map]);


	function closeError() {
		setOpenError(false);
	}

	function closeSuccess() {
		setOpenSuccess(false);
	}

	const toggleSearchWrapper = function () {
		dispatch(toggleSearchDraw());
	}

	const handleDrawOpen = (e) => {
		setLeftDraw(true);
	};


	const handleDrawClose = () => {
		setLeftDraw(false);

	};

	function channelDisplay(channel) {
			return (<ListItem button key={channel.key} onClick={() =>{dispatch(openCategoryDraw())}}>
				<ListItemIcon>
					<SearchIcon/>
				</ListItemIcon>
				<ListItemText primary={channel.name}/>
			</ListItem>)
	}

	const RenderDraw = function () {
		return (
			<React.Fragment key={'leftDraw'}>
				<Drawer
					anchor={'left'}
					open={leftDraw}
					onClose={handleDrawClose}
					className={classes.drawLeft}
				>
					<Box
						role="presentation"
						onClick={handleDrawClose}
						onKeyDown={handleDrawClose}
					>

						<ListItem button key={'Home'} component={Link} to={`/`}>
							<ListItemIcon>
								<HomeIcon/>
							</ListItemIcon>
							<ListItemText primary={'Home'}/>
						</ListItem>

						<Divider/>

						{channels.listChannels().map(function (channel) {
							if (channels.displayChannel(channel))
								return channelDisplay(channels.getChannelProperties(channel));
						})}

						<Divider/>

						{pages.listPages().map(function (page) {
							return (
								<ListItem button component={Link} to={`/Page/${page.page}`} key={page.page}>
									<ListItemIcon>
										{page.icon}
									</ListItemIcon>
									<ListItemText primary={page.title}/>
								</ListItem>
							)
						})}
					</Box>
				</Drawer>
			</React.Fragment>
		);
	}

	return (
		<div>
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
			<div>
				<div className={classes.grow}>
					<IntroModal/>
					<BottomNavigation className={classes.nav} id={"navMain"}>

						<BottomNavigationAction label="Menu" icon={<MenuIcon color="icons"/>} onClick={handleDrawOpen}/>
						<BottomNavigationAction label="Search" icon={<SearchIcon color="secondary" fontSize="large"/>}
						                        onClick={() => {toggleSearchWrapper()}}/>
						<NavProfile/>
					</BottomNavigation>
					<SearchDraw  mapRef={mapRef} updateMap={forceMapRefresh} />
					<RenderDraw/>
					<ViewDraw mapRef={mapRef}/>
					<Multi mapRef={mapRef}/>
					<CategoryDraw></CategoryDraw>
				</div>
				<div>
					{displayMap()}

					{children}


				</div>

			</div>
		</div>
	);

	function displayMap() {
		if (map === true) {
			return (
				<div className={fullscreen ? classes.mapContainerFull : classes.mapContainer}>
					<Map ref={mapRef} onFeatureSeleted={handleFeatureSelected}
					     onZoomChange={configs.cluster ? onZoomChange : undefined}/>
				</div>
			)
		}
	}
};


export default Layout;
