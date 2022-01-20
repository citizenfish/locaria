import {Divider, Drawer} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import React, {forwardRef, useContext, useImperativeHandle} from "react";
import {useStyles} from "stylesLocaria";
import {configs} from "themeLocaria";
import LocariaContext from "../context/locariaContext";
import DirectionsBoatOutlinedIcon from '@mui/icons-material/DirectionsBoatOutlined';
import SearchDrawCard from "./searchDrawCard";
import {InView} from "react-intersection-observer";
import LinearProgress from "@mui/material/LinearProgress";


const SearchDraw = forwardRef((props, ref) => {
		const classes = useStyles();
		const [searchDraw, setSearchDraw] = React.useState(false);
		const [isInView, setIsInView] = React.useState(false);
		const [moreResults, setMoreResults] = React.useState(false);
		const [searchResults, setSearchResults] = React.useState([]);
		const myContext = useContext(LocariaContext);


		const toggleSearchDraw = () => {
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
			const newSearchValue = document.getElementById('mySearch').value;
			myContext.updateHomeSearch(newSearchValue);
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
						placeholder="Search a name, ship, etc..."
						variant="filled"
						onKeyDown={handleKeyDown}
					/>
					<IconButton onClick={() => {
						doSearch('new')
					}} type="submit" aria-label="search">
						<SearchIcon className={classes.icons}/>
					</IconButton>
				</div>
				<div className="custom-scroll" className={classes.searchDrawResults}>
					{searchResults.length > 0 ? (
						<div className={classes.searchDrawResultList}>
							{searchResults.map((item, index) => (
								<SearchDrawCard key={index} {...item} />
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