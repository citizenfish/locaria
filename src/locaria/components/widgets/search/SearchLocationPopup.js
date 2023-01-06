import React, {useEffect, useState} from "react";
import {
	Backdrop,
	ListItem,
	ListItemIcon,
	ListItemText,
	TextField
} from "@mui/material";
import List from "@mui/material/List";
import {useDispatch, useSelector} from "react-redux";
import {
	locationPopup,
	setCurrentLocation,
	setGeolocation,
	setLocation, setQuestionsOpen

} from "../../redux/slices/searchDrawerSlice";
import {useHistory} from "react-router-dom";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import NearMeIcon from '@mui/icons-material/NearMe';
import PlaceIcon from '@mui/icons-material/Place';
import {getLocation} from "libs/geolocation";
import {useCookies} from "react-cookie";
import {encodeSearchParams} from "libs/searchParams";
import {v4} from "uuid";

export default function SearchLocationPopup({defaultPage, maxLocations = 8, display = true}) {
	const dispatch = useDispatch();
	const history = useHistory();

	const open = useSelector((state) => state.searchDraw.locationOpen);
	const locationPage = useSelector((state) => state.searchDraw.locationPage);
	const currentLocation = useSelector((state) => state.searchDraw.currentLocation);
	const geolocation = useSelector((state) => state.searchDraw.geolocation);
	const mobile = useSelector((state) => state.mediaSlice.mobile);
	const innerWidth = useSelector((state) => state.mediaSlice.innerWidth);

	const [cookies, setCookies] = useCookies(['doNotReRender']);

	const [results, setResults] = useState([]);
	const [visible, setVisible] = useState(display);
	const [searchText, setSearchText] = useState("");


	function handleClose() {
		dispatch(locationPopup({open: false, page: locationPage}));
	}

	function handleListItemClick(fid, name, location, store) {

		let locationPacket = {text: name, fid: fid, location: location};
		if (store !== false) {
			// dedupe

			let newRecent = cookies['recentLocations'] || [];
			let dupe = false;
			for (let l in newRecent) {
				if (newRecent[l].fid === fid) {
					dupe = true;
					break;
				}
			}

			if (!dupe) {
				if (newRecent.length > 5)
					newRecent.shift();
				newRecent.push(locationPacket);
				setCookies('recentLocations', newRecent, {path: '/', sameSite: true});
			}
		}
		setCookies('currentLocation', locationPacket, {path: '/', sameSite: true});

		// Did we send a default page? If not it may be undefined and we let the site Panels update
		if (locationPage !== undefined) {
			let encodedPage = locationPage + encodeSearchParams({
				location: location
			})
			history.push(encodedPage);
		} else {
			if (display === false)
				dispatch(setLocation(locationPacket.location));
		}
		dispatch(setCurrentLocation(locationPacket));
		dispatch(locationPopup({open: false}));
		dispatch(setQuestionsOpen(true));
	}


	function handleGeoSuccess(location) {
		dispatch(setGeolocation(location));
		handleListItemClick("geo", "Nearby", location, false);
	}

	function handleGeoError() {
		dispatch(setGeolocation(false));
	}

	useEffect(() => {
		window.websocket.registerQueue("locationSearch", function (json) {
			setResults(json.packet.results);
		});

	}, []);

	useEffect(() => {
		if (open === true && visible === false) {
			setVisible(true);
		}
		if (open === false && display === false) {
			setVisible(false);
		}
	}, [open]);

	useEffect(() => {
		if (searchText !== "") {
			let packetSearch = {
				"queue": "locationSearch",
				"api": "api",
				"data": {
					"method": "search",
					"typeahead": "true",
					"search_text": searchText,
					"display_limit": maxLocations
				}
			};
			window.websocket.send(packetSearch);
		}

	}, [searchText]);

	function GeolocationItem() {
		if (geolocation === false) {
			return (
				<ListItem disabled={true}
						  key={"Nearby"}>
					<ListItemIcon>
						<NearMeIcon/>
					</ListItemIcon>
					<ListItemText primary={"Local location not available"}/>
				</ListItem>
			)
		}

		if (geolocation === undefined) {
			return (
				<ListItem onClick={() => {
					getLocation(handleGeoSuccess, handleGeoError)
				}}
						  key={"Nearby"}>
					<ListItemIcon>
						<NearMeIcon/>
					</ListItemIcon>
					<ListItemText primary={"Nearby"}/>
				</ListItem>
			)
		}

		return (
			<ListItem onClick={() => handleListItemClick("fid", "nearby", geolocation, false)}
					  key={"Nearby"}>
				<ListItemIcon>
					<NearMeIcon/>
				</ListItemIcon>
				<ListItemText primary={`Nearby`}/>
			</ListItem>
		)

	}

	function ResultItems() {
		let returnArray = [];

		// Locate results category that is Location
		for (let r in results) {
			// is results category Location?
			if (results[r].category === "Location") {
				// Push Locations to the returnArray
				for (let i = 0; i < maxLocations && i < results[0]['jsonb_agg'].length; i++) {
					returnArray.push(<Divider key={v4()} variant="inset" component="li"/>);
					returnArray.push(
						<ListItem
							onClick={() => handleListItemClick(results[r]['jsonb_agg'][r].fid, results[r]['jsonb_agg'][i].text, results[r]['jsonb_agg'][i].location)}
							key={v4()}>
							<ListItemIcon>
								<PlaceIcon/>
							</ListItemIcon>
							<ListItemText primary={results[0]['jsonb_agg'][i].text}/>
						</ListItem>
					)
				}
			}
		}

		return returnArray;
	}

	function RecentItems() {
		if (cookies && cookies['recentLocations'] && cookies['recentLocations'].length > 0 && (results === null || results === undefined || results.length === 0)) {
			let recentItemsArray = [];
			for (let i in cookies['recentLocations']) {
				recentItemsArray.push(
					<ListItem
						onClick={() => handleListItemClick(cookies['recentLocations'][i].fid, cookies['recentLocations'][i].text, cookies['recentLocations'][i].location)}
						key={`ri2Key${i}`}>
						<ListItemIcon>
							<PlaceIcon/>
						</ListItemIcon>
						<ListItemText primary={cookies['recentLocations'][i].text}/>
					</ListItem>
				)
			}
			return (
				<>
					<ListItem key={"recent"}><ListItemText primary={"Recent items"}></ListItemText></ListItem>
					<Divider variant="inset" component="li"/>
					{recentItemsArray}
				</>
			)
		}
		return <></>
	}









	let width = innerWidth;
	if (width > 700)
		width = 700;
	else width = width - 60;

	let textSx = {
		background: "#fff",
		width: `${width}px`,
		marginTop: "6px"
	};


	let boxSx = {
		position: "absolute",
		top: "35px",
		left: `calc( 50% - ${width / 2}px )`,
		width: `${width}px`,
		boxShadow: 3
	}

	if (mobile) {
		textSx.width = `${width}px`;
		boxSx.top = "30px";
	}


	if (!visible) {
		boxSx.display = 'none';
	}

	if (display === false) {
		boxSx.top = "50px";
	}

	return (
		<Box sx={boxSx}>
			<Backdrop open={open} sx={{zIndex: 100}} onClick={handleClose}>
			</Backdrop>


			<List sx={{pt: 0, zIndex: 101, background: '#fff', borderRadius: "5px"}}>
				<ListItem>
					<TextField autoComplete={"off"}
							   value={searchText || open ? searchText : (currentLocation ? currentLocation.text : 'Where are you?')}
							   sx={textSx} id={"locationSearchText"} onClick={() => {
						if (open === false) {
							dispatch(locationPopup({open: true, page: defaultPage}));
						}
					}}
							   onChange={(e) => {
								   setSearchText(e.target.value);
							   }}
					></TextField>
				</ListItem>
				<List sx={{pt: 0, display: open ? 'block' : 'none'}}>
					<>
						<Divider component="li"/>
						<GeolocationItem></GeolocationItem>
						<RecentItems></RecentItems>
						<ResultItems></ResultItems>
					</>

				</List>

			</List>

		</Box>

	)

}