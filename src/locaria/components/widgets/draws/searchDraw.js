import {Container, Divider, Drawer, useMediaQuery} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import React, {forwardRef, useContext, useImperativeHandle, useRef} from "react";
import {useStyles} from "stylesLocaria";
import {configs, theme} from "themeLocaria";
import LocariaContext from "../../context/locariaContext";
import DirectionsBoatOutlinedIcon from '@mui/icons-material/DirectionsBoatOutlined';
import SearchDrawCard from "../searchDrawCard";
import {InView} from "react-intersection-observer";
import LinearProgress from "@mui/material/LinearProgress";
import {useHistory, useParams} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux'
import {closeSearchDraw, deleteSearchCategory} from "../../redux/slices/searchDrawSlice";
import {closeViewDraw} from "../../redux/slices/viewDrawSlice";
import Chip from "@mui/material/Chip";
import MenuIcon from "@mui/icons-material/Menu";
import DoneIcon from "@mui/icons-material/Done";
import {openCategoryDraw} from "../../redux/slices/categoryDrawSlice";


const SearchDraw = forwardRef((props, ref) => {
		const history = useHistory();
		const dispatch = useDispatch()


		const open = useSelector((state) => state.searchDraw.open);
		const categories = useSelector((state) => state.searchDraw.categories);

		const classes = useStyles();
		const [moreResults, setMoreResults] = React.useState(false);
		const [searchResults, setSearchResults] = React.useState([]);
		const myContext = useContext(LocariaContext);

		let {text} = useParams();

		const isInitialMount = useRef(true);

		React.useEffect(() => {
			if (isInitialMount.current) {
				isInitialMount.current = false;
			} else {
				if (open === true) {
					dispatch(closeViewDraw());
					history.push(`/Search/`);
					props.mapRef.current.addGeojson({"features": searchResults, type: "FeatureCollection"});
					props.mapRef.current.zoomToLayerExtent("data");
					if (text !== undefined) {
						document.getElementById('mySearch').value = text;
						doSearch('new');
					}
				} else {
					history.push(`/`);
					props.updateMap();

				}
			}
		}, [open]);

		React.useEffect(() => {
			doSearch('new');

		},[categories]);


		React.useEffect(() => {

			window.websocket.registerQueue("searchLoader", function (json) {
				setMoreResults(json.packet.features.length === configs.searchLimit);
				const newResults = searchResults.concat(json.packet.features);
				setSearchResults(newResults);
				props.mapRef.current.addGeojson({"features": newResults, type: "FeatureCollection"});
				props.mapRef.current.zoomToLayerExtent("data");

			});

			return () => {
				window.websocket.removeQueue("searchLoader");
			}


		}, [searchResults]);

		function handleKeyDown(e) {
			if (e.key === 'Enter') {
				doSearch('new');

			}

		}

		function doSearch(mode = 'new') {
			let newSearchValue = document.getElementById('mySearch').value;
			let offset = searchResults.length;
			if (mode === 'new') {
				setSearchResults([]);
				offset = 0;
			}

			let packet = {
				"queue": "searchLoader",
				"api": "api",
				"data": {
					"method": "search",
					"category": categories.length>0? categories:configs.homeCategorySearch,
					"search_text": newSearchValue,
					"limit": configs.searchLimit,
					"offset": offset
				}
			};


			if (configs.homeMode !== "Search") {
				newSearchValue = newSearchValue.toUpperCase();
				document.getElementById('mySearch').value = newSearchValue;
				packet = {
					"queue": "searchLoader",
					"api": "api",
					"data": {
						"method": "location_search",
						"address": newSearchValue
					}
				}
			}
			myContext.updateHomeSearch(newSearchValue);
			window.websocket.send(packet);
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
				className={classes.searchDraw}
				variant="persistent"
			>
				<div className={classes.searchDrawHeader}>
					<Typography className={classes.searchDrawTitle} variant={'h5'}>{configs.searchTitle}</Typography>
					<IconButton onClick={()=>{dispatch(closeSearchDraw());}} className={classes.searchDrawClose} type="submit"
					            aria-label="search">
						<CloseIcon className={classes.icons}/>
					</IconButton>
				</div>
				<Divider/>
				<div className={classes.searchDrawSearch}>
					<MenuIcon color="icons" className={classes.searchDrawAdvancedButton} onClick={() => {
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
						doSearch('new')
					}} type="submit" aria-label="search">
						<SearchIcon className={classes.icons}  />
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