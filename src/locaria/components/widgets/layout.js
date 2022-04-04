
import React, {useRef} from 'react';

import {configs} from "themeLocaria";
import {useStyles} from "stylesLocaria";

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {useCookies} from 'react-cookie';
import {Link, useHistory, useLocation, useParams} from 'react-router-dom';
import Map from "./map";
import {
	BottomNavigation,
	BottomNavigationAction, Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import {NavProfile} from "./navProfile";
import {SearchDrawer} from "./drawers/searchDrawer";
import {ViewDrawer} from "./drawers/viewDrawer";
import LandingDrawer from "./drawers/landingDrawer";
import MenuDrawer from "./drawers/menuDrawer";
import Multi from "./multi";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from 'react-redux'
import {closeSearchDrawer, openSearchDrawer, resolutionUpdate, toggleSearchDrawer} from '../redux/slices/searchDrawerSlice'
import {closeViewDraw, openViewDraw} from '../redux/slices/viewDrawerSlice'
import {closeMultiSelect, openMultiSelect} from '../redux/slices/multiSelectSlice'
import { openMenuDraw} from '../redux/slices/menuDrawerSlice'
import PageDrawer from "./drawers/pageDrawer";
import {closeLayout, openLayout,setLocation, setResolutions} from "../redux/slices/layoutSlice";
import Typography from "@mui/material/Typography";
import {openPageDialog} from "../redux/slices/pageDialogSlice";
import {closeLandingDraw, openLandingDraw} from "../redux/slices/landingDrawerSlice";



import NavFabFilter from "./fabs/navFabFilter";


const Layout = ({children, map, fullscreen = false}) => {
	const mapRef = useRef();
	const location = useLocation();
	// params?

	let {category} = useParams();
	let {pageId} = useParams();
	let {feature} = useParams();
	let {search} = useParams();
	const classes = useStyles();

	const dispatch = useDispatch()
	const history = useHistory();


	const [openError, setOpenError] = React.useState(false);
	const [openSuccess, setOpenSuccess] = React.useState(false);
	const [features, setFeatures] = React.useState({});
	const viewDrawOpen = useSelector((state) => state.viewDraw.open);
	const searchDrawOpen = useSelector((state) => state.searchDraw.open);
	const open = useSelector((state) => state.layout.open);
	const homeLocation = useSelector((state) => state.layout.homeLocation);

	const resolutions = useSelector((state) => state.layout.resolutions);


	const [cookies, setCookies] = useCookies(['location']);

	const isInitialMount = useRef(true);

	const drawStateRouter = () => {

		if(location.pathname==='/') {
			dispatch(openLandingDraw());
			return;
		}



		if (location.pathname.match('^/Search/.*')&&searchDrawOpen===false) {
			if(category) {
				dispatch(openSearchDrawer({categories: JSON.parse(category),search:search}));
			} else {
				dispatch(openSearchDrawer());
			}

			return;
		}


		if (feature&&viewDrawOpen===false) {
			dispatch(openViewDraw({fid:feature,category:category}));
			return;
		}

		if (location.pathname.match('^/Map')&&open === false) {
			dispatch(openLayout())
			return;
		}
	}

	React.useEffect(() => {


		if (isInitialMount.current) {
			isInitialMount.current = false;
			drawStateRouter();

		} else {
			if(open) {
				history.push(`/Map`);
				dispatch(closeLandingDraw());
				dispatch(closeSearchDrawer());
				dispatch(closeMultiSelect());
				//forceMapRefresh();
				displayMapData();

			}
		}

		window.websocket.registerQueue("homeLoader", function (json) {
			if (map === true) {
				if(open===true)
					mapRef.current.addGeojson(json.packet);
				setFeatures(json.packet);
			}
		});

		return () => {
			window.websocket.removeQueue("homeLoader");
		}

	}, [open]);


	function displayMapData() {
		mapRef.current.addGeojson(features);
	}

	const handleFeatureSelected = function (features,geojsonFeatures) {
		if (features[0].get('geometry_type') === 'cluster') {
			mapRef.current.zoomToExtent(features[0].get('extent'));
		} else {
			if(features.length>1)  {
				dispatch(openMultiSelect(geojsonFeatures.features));
			} else {
				dispatch(openViewDraw({fid:features[0].get('fid'),category:features[0].get('category')}));
			}
		}
	}

	const forceMapRefresh = () => {
		if(resolutions!==undefined) {
			if(open===true||features.features===undefined) {
				updateMap(resolutions);
			}
		}
	}

	const onZoomChange = (newRes) => {
		dispatch(setResolutions(newRes));
		//setResolutions(newRes);
	}

	React.useEffect(() => {
		if(resolutions!==undefined)
			forceMapRefresh();
	}, [resolutions]);

	React.useEffect(() => {
		if(pageId) {
			dispatch(openPageDialog(pageId));
		}

	}, [pageId]);

	React.useEffect(() => {

		if(homeLocation!==false&&homeLocation!==undefined&&map===true&&configs.location!==false) {
			mapRef.current.markHome(homeLocation);
			setCookies('location', homeLocation,{path: '/', sameSite: true});
		}

	}, [homeLocation]);

	const updateMap = (newRes) => {
		let packet = {
			"queue": "homeLoader",
			"api": "api",
			"data": {
				"method": "search",
				"category": configs.homeCategorySearch,
				"bbox": `${newRes.extent4326[0]} ${newRes.extent4326[1]},${newRes.extent4326[2]} ${newRes.extent4326[3]}`,
				"cluster": newRes.resolution >= configs.clusterCutOff,
				"cluster_width": Math.floor(configs.clusterWidthMod * newRes.resolution),
				"cluster_algorithm": configs.clusterAlgorithm
			}
		};
		window.websocket.send(packet);
	}


	React.useEffect(() => {



		if (map === true  ) {
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
				dispatch(setLocation(cookies.location))
			} else {
				console.log('no location');
			}

		}

	}, [map]);


	function closeError() {
		setOpenError(false);
	}

	function closeSuccess() {
		setOpenSuccess(false);
	}

	const toggleSearchWrapper = function () {
		if(searchDrawOpen===true) {
			dispatch(closeSearchDrawer());
		} else {
			dispatch(openSearchDrawer());

		}

	/*	dispatch(toggleSearchDrawer());
		if(open===false) {
			dispatch(openLayout());
		}*/
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

					<SearchDrawer mapRef={mapRef}/>
					<MenuDrawer/>
					<ViewDrawer mapRef={mapRef}/>
					<Multi mapRef={mapRef}/>
                    <BottomNavigation className={classes.nav} id={"navMain"}>
						<BottomNavigationAction className={classes.NavMenuButton}  icon={<MenuIcon color="icons"/>} onClick={()=>{dispatch(openMenuDraw());}}/>

					<Grid xs={12} className={classes.NavSiteTitle}>
						<Grid item xs={12}>
							<Typography className={classes.NavSiteTitleText} variant="h6" >
								{configs.siteTitle.toUpperCase()}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography className={classes.NavSiteSubTitleText} variant = "body2">
								{configs.siteSubTitle}
							</Typography>
						</Grid>
					</Grid>


					<BottomNavigationAction className={classes.NavSearchButton}
												icon={<SearchIcon color="icons" fontSize="large"/>}
												onClick={() => {toggleSearchWrapper()}}/>
	                    <NavProfile/>
					</BottomNavigation>
					<LandingDrawer/>
					<PageDrawer/>

				</div>
				<div>
					{
						map &&
						<div className={fullscreen ? classes.mapContainerFull : classes.mapContainer}>
							<Map id={'mainMap'}
								 className={'mapView'}
								 ref={mapRef}
								 onFeatureSeleted={handleFeatureSelected}
								 onZoomChange={configs.cluster ? onZoomChange : undefined}
							/>

								<NavFabFilter/>

						</div>
					}

					{children}


				</div>

			</div>
		</div>
	)
}


export default Layout;
