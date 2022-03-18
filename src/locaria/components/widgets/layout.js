
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
	BottomNavigationAction,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import {NavProfile} from "./navProfile";
import {SearchDraw} from "./draws/searchDraw";
import {ViewDraw} from "./draws/viewDraw";
import CategoryDraw from "./draws/categoryDraw";
import LandingDraw from "./draws/landingDraw";
import MenuDraw from "./draws/menuDraw";
import Multi from "./multi";

import { useSelector, useDispatch } from 'react-redux'
import { openSearchDraw ,toggleSearchDraw} from '../redux/slices/searchDrawSlice'
import {closeViewDraw, openViewDraw} from '../redux/slices/viewDrawSlice'
import { openMultiSelect} from '../redux/slices/multiSelectSlice'
import { openMenuDraw} from '../redux/slices/menuDrawSlice'
import PageDraw from "./draws/pageDraw";
import {setLocation, setResolutions} from "../redux/slices/layoutSlice";
import Typography from "@mui/material/Typography";
import {openPageDialog} from "../redux/slices/pageDialogSlice";
import {closeLandingDraw} from "../redux/slices/landingDrawSlice";

const Layout = ({children, map, update, fullscreen = false}) => {
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
	const viewDrawOpen = useSelector((state) => state.viewDraw.open);
	const searchDrawOpen = useSelector((state) => state.searchDraw.open);
	const open = useSelector((state) => state.layout.open);
	const homeLocation = useSelector((state) => state.layout.homeLocation);

	const resolutions = useSelector((state) => state.layout.resolutions);


	const [cookies, setCookies] = useCookies(['location']);

	const isInitialMount = useRef(true);

	React.useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			if (open === true) {
				history.push(`/Map`);
				forceMapRefresh();
				dispatch(closeLandingDraw());
			}
		}

		window.websocket.registerQueue("homeLoader", function (json) {
			if (map === true && open === true) {
				mapRef.current.addGeojson(json.packet)
			}
		});

		return () => {
			window.websocket.removeQueue("homeLoader");
		}

	}, [open]);


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
		if(resolutions!==undefined&&viewDrawOpen===false&&searchDrawOpen===false) {
			updateMap(resolutions);
			console.log('Forced refresh');

		}
	}

	const onZoomChange = (newRes) => {
		console.log('Zoom refresh');
		console.log(newRes);
		dispatch(setResolutions(newRes));
		//setResolutions(newRes);
	}

	React.useEffect(() => {
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

		if (location.pathname.match('^/Search/.*')) {
			if(category) {
					dispatch(openSearchDraw({categories: JSON.parse(category),search:search}));
			} else {
				dispatch(openSearchDraw());
			}

		}





		if (feature) {
			dispatch(openViewDraw({fid:feature,category:category}));

		}

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
		dispatch(toggleSearchDraw());
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
					<SearchDraw  mapRef={mapRef} updateMap={forceMapRefresh} />
					<MenuDraw/>
					<ViewDraw mapRef={mapRef}/>
					<Multi mapRef={mapRef}/>
					<CategoryDraw></CategoryDraw>
					<PageDraw></PageDraw>
                    <BottomNavigation className={classes.nav} id={"navMain"}>
						<BottomNavigationAction className={classes.NavMenuButton}  icon={<MenuIcon color="icons"/>} onClick={()=>{dispatch(openMenuDraw());}}/>
	                    <div  style={{backgroundImage: `url(${configs.siteLogo})`}} className={classes.NavSiteLogo}/>
	                    <BottomNavigationAction className={classes.NavSearchButton}  icon={<SearchIcon color="contrastIcons" fontSize="large"/>}
												onClick={() => {toggleSearchWrapper()}}/>
	                    <NavProfile/>
					</BottomNavigation>
					<LandingDraw></LandingDraw>
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
					<Map id={'mainMap'} className={'mapView'} ref={mapRef} onFeatureSeleted={handleFeatureSelected}
					     onZoomChange={configs.cluster ? onZoomChange : undefined}/>
				</div>
			)
		}
	}
};


export default Layout;
