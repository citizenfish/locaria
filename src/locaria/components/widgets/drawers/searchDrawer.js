import {Container, Divider, Drawer, useMediaQuery} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import React, {forwardRef, useContext, useImperativeHandle, useRef} from "react";
import {useStyles} from "stylesLocaria";
import {configs, theme, channels} from "themeLocaria";
import Grid from "@mui/material/Grid";
import LocariaContext from "../../context/locariaContext";
import DirectionsBoatOutlinedIcon from '@mui/icons-material/DirectionsBoatOutlined';
import SearchDrawCard from "./cards/searchDrawCard";
import {InView} from "react-intersection-observer";
import LinearProgress from "@mui/material/LinearProgress";
import {useHistory, useParams} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux'
import {
	closeSearchDraw,
	deleteSearchCategory,
	openSearchDraw,
	setSearch,
	toggleLocationShow,
	setDistance, deleteTag
} from "../../redux/slices/searchDrawSlice";
import {closeViewDraw} from "../../redux/slices/viewDrawSlice";
import Chip from "@mui/material/Chip";
import MenuIcon from "@mui/icons-material/Menu";

import {openLayout, closeLayout} from "../../redux/slices/layoutSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Distance from "../../../libs/Distance";
import {closeLandingDraw} from "../../redux/slices/landingDrawSlice";
import AdvancedAccordion from "../advancedAccordion";


const SearchDrawer = forwardRef((props, ref) => {
		const history = useHistory();
		const dispatch = useDispatch()

		const distanceLib = new Distance();

		const open = useSelector((state) => state.searchDraw.open);
		const categories = useSelector((state) => state.searchDraw.categories);
		const search = useSelector((state) => state.searchDraw.search);
		const locationShow = useSelector((state) => state.searchDraw.locationShow);
		const resolutions = useSelector((state) => state.layout.resolutions);
		const distance = useSelector((state) => state.searchDraw.distance);
		const tags = useSelector((state) => state.searchDraw.tags);


		const classes = useStyles();
		const [moreResults, setMoreResults] = React.useState(false);
		const [fit, setFit] = React.useState(true);
		const [searchResults, setSearchResults] = React.useState([]);
		const [locationResults, setLocationResults] = React.useState([]);
		const myContext = useContext(LocariaContext);

		const homeLocation = useSelector((state) => state.layout.homeLocation);

		const isInitialMount = useRef(true);

		const [channel, setChannel] = React.useState(undefined);


	React.useEffect(() => {
			if (isInitialMount.current) {
				isInitialMount.current = false;
			} else {
				if (open === true) {
					history.push(`/Search/${JSON.stringify(categories)}/${search}`);
					dispatch(closeViewDraw());
					dispatch(closeLayout());
					dispatch(closeLandingDraw());
					props.mapRef.current.addGeojson({"features": searchResults, type: "FeatureCollection"});
					props.mapRef.current.zoomToLayersExtent(["data", "location", "home"]);
					/*if (searchResults.length === 0)
						doSearch('new');
*/
				}
			}
		}, [open]);

		React.useEffect(() => {
			setChannel(channels.getChannelProperties(categories[0]));
			if (open === true) {
				history.push(`/Search/${JSON.stringify(categories)}/${search}`);
				doSearch('new');
			}
		}, [categories,tags,open]);


		React.useEffect(() => {
			if (open === true) {
				history.push(`/Search/${JSON.stringify(categories)}/${search}`);
				document.getElementById('mySearch').value=search;
				doSearch('new');
			}
		}, [search]);

		React.useEffect(() => {
			if (open === true) {
				doSearch('new');
			}
		}, [distance]);

		React.useEffect(() => {
			console.log('locationResults change')
			if (open === true&&locationResults.length>0) {

				if (locationShow) {
					props.mapRef.current.addGeojson({
						"features": locationResults,
						type: "FeatureCollection"
					}, "location", true);

				} else {
					props.mapRef.current.addGeojson({
						"features": [locationResults[0]],
						type: "FeatureCollection"
					}, "location", true);

				}
				props.mapRef.current.zoomToLayersExtent(["data", "location", "home"]);

			}


		}, [locationResults, locationShow]);


		React.useEffect(() => {

			window.websocket.registerQueue("searchBulk", function (json) {
				setMoreResults(json.searchLoader.packet.features.length === configs.searchLimit);
				const newResults = searchResults.concat(json.searchLoader.packet.features);
				setSearchResults(newResults);
				//console.log(json.locationLoader);
				if (json.locationLoader.packet.features) {
					setLocationResults(json.locationLoader.packet.features);
				}
				props.mapRef.current.addGeojson({"features": newResults, type: "FeatureCollection"});
				if(fit)
					props.mapRef.current.zoomToLayersExtent(["data", "location", "home"]);
				else
					setFit(false);

			});

			return () => {
				window.websocket.removeQueue("searchLoader");
			}


		}, [searchResults]);


		React.useEffect(() => {
			if (channel && channel.searchReport) {
				setFit(false);
				doSearch();
			}
		},[resolutions]);

		function handleKeyDown(e) {
			if (e.key === 'Enter') {
				setNewSearch();
			}
		}

		function setNewSearch() {
			let newSearchValue = document.getElementById('mySearch').value;
			dispatch(setSearch({search: newSearchValue}));
		}

		function doSearch(mode = 'new') {
			if (open !== true)
				return;
			//let newSearchValue = document.getElementById('mySearch').value;
			let offset = searchResults.length;
			if (mode === 'new') {
				setSearchResults([]);
				offset = 0;
			}

			let packetSearch = {
				"queue": "searchLoader",
				"api": "api",
				"data": {
					"method": "search",
					"category": categories.length > 0 ? categories : configs.homeCategorySearch,
					"search_text": search,
					"limit": configs.searchLimit,
					"offset": offset
				}
			};

			if(tags.length>0) {
				packetSearch.data.tags=tags;
			}

			if (distance > 0) {
				packetSearch.data.location_distance = distanceLib.distanceActual(distance,'km');
				packetSearch.data.location = `SRID=4326;POINT(${homeLocation[0]} ${homeLocation[1]})`;
			}


			if (channel && channel.searchReport) {
				packetSearch.data.method = "report";
				packetSearch.data.report_name = channel.searchReport;
				if(resolutions.resolution >= configs.clusterCutOff)
					packetSearch.data.cluster = true;
				packetSearch.data.bbox = `${resolutions.extent4326[0]} ${resolutions.extent4326[1]},${resolutions.extent4326[2]} ${resolutions.extent4326[3]}`;
			}

			if (search === '' && categories.length === 0) {
				packetSearch.data.tags = ['featured'];
			}

			let packetLocation = {
				"queue": "locationLoader",
				"api": "api",
				"data": {
					"method": "address_search",
					"address": search
				}
			}
			myContext.updateHomeSearch(search);
			window.websocket.sendBulk('searchBulk', [
				packetSearch,
				packetLocation
			]);
			//window.websocket.send(packet);
		}

		const inViewEvent = function (event) {
			console.log(event);
			if (event === true && searchResults.length > 0) {
				doSearch('scroll');
			}
		}

		const LocationResults = () => {
			if (locationResults.length) {
				if (locationShow) {
					return (
						<div className={classes.searchDrawResultList}>
							{locationResults.map((item, index) => (
								<SearchDrawCard more={true} key={index} {...item} mapRef={props.mapRef}/>
							))}
							<div className={classes.SearchDrawMore} onClick={() => {
								dispatch(toggleLocationShow());
							}}>
								Less locations
								<ExpandMoreIcon></ExpandMoreIcon>
							</div>
						</div>
					)
				} else {
					return (
						<div className={classes.searchDrawResultList}>
							{[locationResults[0]].map((item, index) => (
								<SearchDrawCard more={true} key={index} {...item} mapRef={props.mapRef}/>
							))}
							<div className={classes.SearchDrawMore} onClick={() => {
								dispatch(toggleLocationShow());
							}}>
								More locations
								<ExpandMoreIcon></ExpandMoreIcon>
							</div>
						</div>
					)
				}

			}
			return <></>
		}

		return (
			<Drawer
				anchor="bottom"
				open={open}
				className={classes.searchDrawer}
				variant="persistent"
			>
				<div className={classes.searchDrawerHeader}>
					<Typography className={classes.searchDrawerTitle} variant={'h6'}>{configs.searchTitle}</Typography>
					<IconButton onClick={() => {
						dispatch(openLayout());
					}} className={classes.searchDrawerClose} type="submit"
					            aria-label="search">
						<CloseIcon className={classes.icons}/>
					</IconButton>
				</div>
				<Divider/>
				<div className={classes.searchDrawerSearch}>
					<InputBase
						className={classes.searchDrawerBox}
						id="mySearch"
						placeholder={configs.searchPlaceholder}
						variant="filled"
						onKeyDown={handleKeyDown}
						autoComplete={'off'}
						autoFocus={true}
					/>
					<IconButton onClick={() => {
						setNewSearch();
					}} type="submit" aria-label="search">
						<SearchIcon className={classes.iconsLight}/>
					</IconButton>
				</div>

				<AdvancedAccordion>
					<Container className={classes.searchDrawerAdvanced}>
						<Grid container className={classes.searchChosen}>
									<Grid item md={4}>
										<Typography >Categories:</Typography>
									</Grid>
									<Grid item md={8}>
										{ categories.length > 0 &&
											categories.map((category) => (

											<Chip className={classes.chip}
											key={`cat-${category}`}
											label={category}
											onDelete={() => {
											dispatch(deleteSearchCategory(category));
											}}/>))
										}
										{
											categories.length === 0  &&
											<Typography >All categories</Typography>
										}

									</Grid>
						</Grid>


						{ distance > 0 &&
							<Grid container className={classes.searchDistanceChosen}>
								<Grid item md={4}>
									<Typography >Distance:</Typography>
								</Grid>
								<Grid item md={8}>
									<Chip className={classes.chip}
										  label={`Distance within : ${distance}km`}
										  onDelete={() => {
											  dispatch(setDistance(false));
										  }}/> : <></>

								</Grid>
							</Grid>
						}
							{ tags.length > 0 &&
								<Grid container className={classes.searchTagsChosen}>
									<Grid item md={4}>
										<Typography >Tags:</Typography>
									</Grid>
									<Grid item md={8}>
										{tags.map((tag) => (
											<Chip className={classes.chip}
												  key={`tag-${tag}`}
												  label={`tag: ${tag}`}
												  onDelete={() => {
													  dispatch(deleteTag(tag));
												  }}/>))}
									</Grid>
							</Grid>
							}
					</Container>
				</AdvancedAccordion>

				<div className={classes.searchDrawerResults}>
					<LocationResults></LocationResults>
					{searchResults.length > 0 ? (
						<div className={classes.searchDrawerResultList}>
							{searchResults.map((item, index) => (
								<SearchDrawCard key={index} {...item} mapRef={props.mapRef}/>
							))}
							{moreResults ? (
								<div sx={{height: '10px'}}>
									<InView as="div" onChange={(inView, entry) => {
										inViewEvent(inView)
									}}>
									</InView>
									<LinearProgress/>
								</div>
							) : <div/>
							}
						</div>
					) : (
						<div className={classes.searchDrawerNoResults}>
							<DirectionsBoatOutlinedIcon className={classes.searchDrawerNoResultsIcon}/>
							<Typography className={classes.searchDrawerNoResultsText} variant="body1">No results
								found</Typography>
						</div>
					)}
				</div>
			</Drawer>
		)
	}
);

export {SearchDrawer};