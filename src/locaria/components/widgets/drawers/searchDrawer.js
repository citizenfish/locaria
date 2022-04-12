import React, {forwardRef, useContext, useEffect, useRef} from "react";

import {useHistory} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux'
import {setSearch,} from "../../redux/slices/searchDrawerSlice";
import {closeViewDraw} from "../../redux/slices/viewDrawerSlice";
import {openLayout, closeLayout} from "../../redux/slices/layoutSlice";
import {closeLandingDraw} from "../../redux/slices/landingDrawerSlice";

//** MUI **//
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from '@mui/icons-material/Delete';


//** LOCARIA **//

import LocariaContext from "../../context/locariaContext";
import {useStyles} from "stylesLocaria";
import {configs,  channels} from "themeLocaria";
import Distance from "../../../libs/Distance";
import LocationSearchResults from "../searchResults/locationSearchResults";
import FeatureSearchResults from "../searchResults/featureSearchResults";
import {Divider, Drawer} from "@mui/material";

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
		const homeLocation = useSelector((state) => state.layout.homeLocation);

		const classes = useStyles();
		const [moreResults, setMoreResults] = React.useState(false);
		const [fit, setFit] = React.useState(true);
		const [searchResults, setSearchResults] = React.useState([]);
		const [locationResults, setLocationResults] = React.useState([]);
		const [channel, setChannel] = React.useState(undefined);

		const myContext = useContext(LocariaContext);
		const isInitialMount = useRef(true);


		useEffect(() => {
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

		useEffect(() => {
			setChannel(channels.getChannelProperties(categories[0]));
			if (open === true) {
				history.push(`/Search/${JSON.stringify(categories)}/${search}`);
				doSearch('new');
			}
		}, [categories,tags,open]);

		useEffect(() => {
			if (open === true) {
				history.push(`/Search/${JSON.stringify(categories)}/${search}`);
				document.getElementById('mySearch').value=search;
				doSearch('new');
			}
		}, [search]);

		useEffect(() => {
			if (open === true) {
				doSearch('new');
			}
		}, [distance]);

		useEffect(() => {
			console.log('locationResults change')
			if (open === true&&locationResults.length>0) {

				/*if (locationShow) {
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
				props.mapRef.current.zoomToLayersExtent(["data", "location", "home"]);*/

			}


		}, [locationResults, locationShow]);

		useEffect(() => {

			window.websocket.registerQueue("searchBulk", function (json) {
				console.log(json.searchLoader);

				setMoreResults(json.searchLoader.packet.geojson.features.length === configs.searchLimit);
				const newResults = searchResults.concat(json.searchLoader.packet.geojson.features);
				setSearchResults(newResults);
				//console.log(json.locationLoader);
				if (json.locationLoader.packet.features) {
					setLocationResults(json.locationLoader.packet.features);
				} else {
					setLocationResults([]);
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

		useEffect(() => {
			if (channel && channel.searchReport) {
				setFit(false);
				doSearch();
			}
		},[resolutions]);

		const handleKeyDown = (e) => {
			if (e.key === 'Enter') {
				setNewSearch();
			}
		}

		const setNewSearch = () => {
			let newSearchValue = document.getElementById('mySearch').value;
			dispatch(setSearch({search: newSearchValue}));
		}

		const clearSearch = (e) => {
			document.getElementById('mySearch').value = ''
			setNewSearch()
		}

		const doSearch = (mode = 'new') => {
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
					"offset": offset,
					"mask":{"fid":true,"category":true,"tags":true,"description":{"title":true,"text":true}}
				}
			};

			if(tags.length>0) {
				packetSearch.data.tags=tags;
			}

			if (distance > 0) {
				packetSearch.data.location_distance = distanceLib.distanceActual(distance,'km');
				packetSearch.data.location = `SRID=4326;POINT(${homeLocation.location[0]} ${homeLocation.location[1]})`;
			}


			if (channel && channel.searchReport) {
				packetSearch.data.method = "report";
				packetSearch.data.report_name = channel.searchReport;
				if(resolutions.resolution >= configs.clusterCutOff)
					packetSearch.data.cluster = true;
				packetSearch.data.bbox = `${resolutions.extent4326[0]} ${resolutions.extent4326[1]},${resolutions.extent4326[2]} ${resolutions.extent4326[3]}`;
			}

			if (search === '' && categories.length === 0) {
				//packetSearch.data.tags = ['featured'];
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
					<IconButton onClick={() => {setNewSearch()}}
								type="submit"
								aria-label="search">
						<SearchIcon className={classes.iconsLight}/>
					</IconButton>
					<Divider orientation="vertical" className={classes.iconsLight} />
					<IconButton type="submit"
								size="small"
								onClick={clearSearch}
					>
						<DeleteIcon className={classes.iconsLight} />
					</IconButton>
				</div>


				<div className={classes.searchDrawerResults}>
					<Divider/>

					<LocationSearchResults
							locationResults ={locationResults}
							mapRef = {props.mapRef}
							locationShow = {locationShow}
					/>

					<FeatureSearchResults
							featureResults = {searchResults}
							mapRef = {props.mapRef}
							inViewEvent = {inViewEvent}
							moreResults = {moreResults}

					/>

				</div>
				<Divider/>
				<div >

				</div>
			</Drawer>
		)
	}
);

export {SearchDrawer};