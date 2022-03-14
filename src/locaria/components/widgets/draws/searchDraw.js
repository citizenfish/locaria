import {Container, Divider, Drawer, useMediaQuery} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import React, {forwardRef, useContext, useImperativeHandle, useRef} from "react";
import {useStyles} from "stylesLocaria";
import {configs, theme,channels} from "themeLocaria";

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
	toggleLocationShow
} from "../../redux/slices/searchDrawSlice";
import {closeViewDraw} from "../../redux/slices/viewDrawSlice";
import Chip from "@mui/material/Chip";
import MenuIcon from "@mui/icons-material/Menu";
import {openCategoryDraw} from "../../redux/slices/categoryDrawSlice";

import {openLayout,closeLayout} from "../../redux/slices/layoutSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Paper from "@mui/material/Paper";

const SearchDraw = forwardRef((props, ref) => {
		const history = useHistory();
		const dispatch = useDispatch()


		const open = useSelector((state) => state.searchDraw.open);
		const categories = useSelector((state) => state.searchDraw.categories);
		const search = useSelector((state) => state.searchDraw.search);
		const locationShow = useSelector((state) => state.searchDraw.locationShow);
		const resolutions = useSelector((state) => state.layout.resolutions);


		const classes = useStyles();
		const [moreResults, setMoreResults] = React.useState(false);
		const [searchResults, setSearchResults] = React.useState([]);
		const [locationResults, setLocationResults] = React.useState([]);
		const myContext = useContext(LocariaContext);



		const isInitialMount = useRef(true);

		React.useEffect(() => {
			if (isInitialMount.current) {
				isInitialMount.current = false;
			} else {
				if (open === true) {
					history.push(`/Search/${JSON.stringify(categories)}/${search}`);
					dispatch(closeViewDraw());
					dispatch(closeLayout());
					props.mapRef.current.addGeojson({"features": searchResults, type: "FeatureCollection"});
					props.mapRef.current.zoomToLayersExtent(["data","location","home"]);
					if(searchResults.length===0)
						doSearch('new');

				} else {
					dispatch(openLayout());
					//history.push(`/Map`);
					//props.updateMap();

				}
			}
		}, [open]);

		React.useEffect(() => {
			if(open===true) {
				history.push(`/Search/${JSON.stringify(categories)}/${search}`);
				doSearch('new');
			}
		}, [categories]);


		React.useEffect(() => {
			if(open===true) {
				history.push(`/Search/${JSON.stringify(categories)}/${search}`);
				doSearch('new');
			}
		}, [search]);

		React.useEffect(() => {
			console.log('locationResults change')
			if(open===true) {

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
				props.mapRef.current.zoomToLayersExtent(["data","location","home"]);

			}


		}, [locationResults,locationShow]);


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
				props.mapRef.current.zoomToLayersExtent(["data","location","home"]);

			});

			return () => {
				window.websocket.removeQueue("searchLoader");
			}


		}, [searchResults]);

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
			if(open!==true)
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


			let channel=channels.getChannelProperties(categories[0]);
			if(channel&&channel.searchReport) {
				packetSearch.data.method="report";
				packetSearch.data.report_name =channel.searchReport;
				packetSearch.data.cluster=true;
				packetSearch.data.bbox=`${resolutions.extent4326[0]} ${resolutions.extent4326[1]},${resolutions.extent4326[2]} ${resolutions.extent4326[3]}`;
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
			if(locationResults.length) {
				if(locationShow) {
					return (
						<>
							{locationResults.map((item, index) => (
						<SearchDrawCard more={true} key={index} {...item} mapRef={props.mapRef}/>
							))}
							<div className={classes.SearchDrawMore} onClick={()=>{
								dispatch(toggleLocationShow());
							}}>
								Less locations
								<ExpandMoreIcon></ExpandMoreIcon>
							</div>
						</>
					)
				} else {
					return (
						<>
							{[locationResults[0]].map((item, index) => (
								<SearchDrawCard more={true} key={index} {...item} mapRef={props.mapRef}/>
							))}
							<div className={classes.SearchDrawMore} onClick={()=>{
								dispatch(toggleLocationShow());
							}}>
								More locations
								<ExpandMoreIcon></ExpandMoreIcon>
							</div>
						</>
					)
				}

			}
			return <></>
		}

		return (
			<Drawer
				anchor="bottom"
				open={open}
				className={classes.searchDraw}
				variant="persistent"
			>
				<div className={classes.searchDrawHeader}>
					<Typography className={classes.searchDrawTitle} variant={'h5'}>{configs.searchTitle}</Typography>
					<IconButton onClick={() => {
						dispatch(closeSearchDraw());
					}} className={classes.searchDrawClose} type="submit"
					            aria-label="search">
						<CloseIcon className={classes.icons}/>
					</IconButton>
				</div>
				<Divider/>
				<div className={classes.searchDrawSearch}>
					<MenuIcon fontSize="large" color="icons" className={classes.searchDrawAdvancedButton} onClick={() => {
						dispatch(openCategoryDraw());
					}}/>
					<InputBase
						className={classes.searchDrawBox}
						id="mySearch"
						placeholder={configs.searchPlaceholder}
						variant="filled"
						onKeyDown={handleKeyDown}
					/>
					<IconButton onClick={() => {
						setNewSearch();
					}} type="submit" aria-label="search">
						<SearchIcon className={classes.icons}/>
					</IconButton>
				</div>
				{categories.length > 0 &&
				<Container className={classes.searchDrawAdvanced}>
					{categories.map((category) => (
						<Chip label={category} onDelete={() => {
							dispatch(deleteSearchCategory(category));
						}}/>
					))}
				</Container>
				}
				<div className={classes.searchDrawResults}>
					{searchResults.length > 0 ? (
						<div className={classes.searchDrawResultList}>
							<LocationResults></LocationResults>
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
						<div className={classes.searchDrawNoResults}>
							<DirectionsBoatOutlinedIcon className={classes.searchDrawNoResultsIcon}/>
							<Typography className={classes.searchDrawNoResultsText} variant="body1">No results
								found</Typography>
						</div>
					)}
				</div>
			</Drawer>
		)
	}
);

export {SearchDraw};