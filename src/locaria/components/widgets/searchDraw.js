import {Divider, Drawer, useMediaQuery} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import React, {forwardRef, useContext, useImperativeHandle} from "react";
import {useStyles} from "stylesLocaria";
import {configs,theme} from "themeLocaria";
import LocariaContext from "../context/locariaContext";
import DirectionsBoatOutlinedIcon from '@mui/icons-material/DirectionsBoatOutlined';
import SearchDrawCard from "./searchDrawCard";
import {InView} from "react-intersection-observer";
import LinearProgress from "@mui/material/LinearProgress";
import {useHistory} from "react-router-dom";


const SearchDraw = forwardRef((props, ref) => {
	const history = useHistory();

		const classes = useStyles();
		const [searchDraw, setSearchDraw] = React.useState(false);
		const [isInView, setIsInView] = React.useState(false);
		const [moreResults, setMoreResults] = React.useState(false);
		const [searchResults, setSearchResults] = React.useState([]);
		const myContext = useContext(LocariaContext);

		const toggleSearchDraw = () => {
			if(searchDraw) {
				history.push(`/`);
			} else {
				history.push(`/Search/`);
			}

			setSearchDraw(!searchDraw);
		}

		React.useEffect(() => {

			window.websocket.registerQueue("searchLoader", function (json) {
				setMoreResults(json.packet.features.length===configs.searchLimit);
				setSearchResults(searchResults.concat(json.packet.features));
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
					"category": configs.homeCategorySearch,
					"search_text": newSearchValue,
					"limit": configs.searchLimit,
					"offset": offset
				}
			};


			if(configs.homeMode!=="Search") {
				newSearchValue=newSearchValue.toUpperCase();
				document.getElementById('mySearch').value=newSearchValue;
				packet= {
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
			setIsInView(event);
			if (event === true && searchResults.length > 0) {
				doSearch('scroll');
			}
		}


		useImperativeHandle(
			ref,
			() => ({
				toggleSearchDraw() {
					return toggleSearchDraw();
				}
			})
		)


		return (
			<Drawer
				anchor="bottom"
				open={searchDraw}
				className={classes.searchDraw}
				variant="persistent"
			>
				<div className={classes.searchDrawHeader}>
					<Typography className={classes.searchDrawTitle} variant={'h5'}>{configs.searchTitle}</Typography>
					<IconButton onClick={toggleSearchDraw} className={classes.searchDrawClose} type="submit"
					            aria-label="search">
						<CloseIcon className={classes.icons}/>
					</IconButton>
				</div>
				<Divider/>
				<div className={classes.searchDrawSearch}>
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
						<SearchIcon className={classes.icons}/>
					</IconButton>
				</div>
				<div className={classes.searchDrawResults}>
					{searchResults.length > 0 ? (
						<div className={classes.searchDrawResultList}>
							{searchResults.map((item, index) => (
								<SearchDrawCard key={index} {...item} viewWrapper={props.viewWrapper}/>
							))}
							{moreResults? (
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