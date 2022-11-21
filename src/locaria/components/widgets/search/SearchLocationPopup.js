import React, {useEffect, useState} from "react";
import {
	Backdrop,
	Dialog,
	DialogTitle,
	ListItem,
	ListItemIcon,
	ListItemText,
	mobileStepperClasses,
	TextField
} from "@mui/material";
import List from "@mui/material/List";
import {useDispatch, useSelector} from "react-redux";
import {locationPopup, setFeatures, setGeolocation, setLocation, setSearch} from "../../redux/slices/searchDrawerSlice";
import {useHistory} from "react-router-dom";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import NearMeIcon from '@mui/icons-material/NearMe';
import PlaceIcon from '@mui/icons-material/Place';
import {setupField} from "../../redux/slices/formSlice";
import {getLocation} from "../../../libs/geolocation";
import {useCookies} from "react-cookie";
import {encodeSearchParams} from "../../../libs/searchParams";

export default function SearchLocationPopup({defaultPage}) {
	const dispatch = useDispatch();
	const history = useHistory();

	const open = useSelector((state) => state.searchDraw.locationOpen);
	const page = useSelector((state) => state.searchDraw.locationPage);
	const geolocation = useSelector((state) => state.searchDraw.geolocation);
	const mobile = useSelector((state) => state.mediaSlice.mobile);
	const innerWidth = useSelector((state) => state.mediaSlice.innerWidth);

	const [cookies, setCookies] = useCookies([]);

	const [results, setResults] = useState([]);
	const [searchText, setSearchText] = useState("");

	function handleClose() {
		dispatch(locationPopup({open: false, page: page}));
	}

	function handleListItemClick(fid,name,location,store) {
		if(store!==false) {
			let newRecent=cookies['recentLocations']||[];
			if(newRecent.length>5)
				newRecent.shift();
			newRecent.push({text: name, fid: fid, location: location});
			setCookies('recentLocations', newRecent, {path: '/', sameSite: true});
		}
		let encodedPage=page+encodeSearchParams({
			location:location
		})
		history.push(encodedPage);
		dispatch(locationPopup({open: false}));
	}


	function handleGeoSuccess(location) {
		dispatch(setGeolocation(location));
		handleListItemClick("geo","gelocation",location,false);
	}

	function handleGeoError(location) {
		dispatch(setGeolocation(false));
	}

	useEffect(() => {
		window.websocket.registerQueue("locationSearch", function (json) {
			setResults(json.packet.results);
		});

	}, []);

	useEffect(() => {
		if(searchText!="") {
			let packetSearch = {
				"queue": "locationSearch",
				"api": "api",
				"data": {
					"method": "search",
					"typeahead":"true",
					"search_text": searchText,
					"display_limit": 10
				}
			};
			window.websocket.send(packetSearch);
		}

	}, [searchText]);

	function GeolocationItem() {
		if (geolocation === false) {
			return (
				<ListItem button disabled={true}
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
				<ListItem button onClick={() => {
					getLocation(handleGeoSuccess,handleGeoError)
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
			<ListItem button onClick={() => handleListItemClick("fid","nearby",geolocation,false)}
					  key={"Nearby"}>
				<ListItemIcon>
					<NearMeIcon/>
				</ListItemIcon>
				<ListItemText primary={`Nearby ${geolocation[0]},${geolocation[1]}`}/>
			</ListItem>
		)

	}

	function ResultItems() {
		if(results&&results[0]&&results[0].jsonb_agg) {
			return (
				results[0].jsonb_agg.map((feature) => (
					<>
						<Divider variant="inset" component="li" />
						<ListItem button
								  onClick={() => handleListItemClick(feature.fid,feature.text,feature.location)}
								  key={feature.fid}>
							<ListItemIcon>
								<PlaceIcon/>
							</ListItemIcon>
							<ListItemText primary={feature.text}/>
						</ListItem>
					</>
				))
			)
		}
		return <></>
	}

	function RecentItems() {
		if(cookies&&cookies['recentLocations']&&cookies['recentLocations'].length>0&& ( results===undefined || results.length===0)) {
			return (
				<>
					<ListItem><ListItemText primary={"Recent items"}></ListItemText></ListItem>
					<Divider variant="inset" component="li" />

					{cookies['recentLocations'].map((feature) => (
					<ListItem button
							  onClick={() => handleListItemClick(feature.fid,feature.text,feature.location)}
							  key={feature.fid}>
						<ListItemIcon>
							<PlaceIcon/>
						</ListItemIcon>
						<ListItemText primary={feature.text}/>
					</ListItem>
				))}
				</>
			)
		}
		return <></>
	}


	let width=innerWidth;
	if(width>800)
		width=800;
	else width=width-60;

	let textSx={
		background: "#fff",
		width:`${width}px`
	};

	if(mobile) {
		textSx.width=`${width}px`;
	}

	return (
		<Box sx={{
			position: "absolute",
			top: `calc( 50% - 100px )`,
			left: `calc( 50% - ${width/2}px )`,
			width: `${width}px`,
		}}>
			<Backdrop open={open} sx={{zIndex: 100}} onClick={handleClose}>
			</Backdrop>

			<List sx={{pt: 0, zIndex: 101, background: '#fff', borderRadius: "12px"}}>
				<ListItem button>
					<TextField value={searchText} sx={textSx} id={"locationSearchText"} onClick={() => {
						dispatch(locationPopup({open: true, page: defaultPage}));
					}}
							   onChange={(e) => {
								   setSearchText(e.target.value);
							   }}
					></TextField>
				</ListItem>
				<List sx={{pt: 0, display: open ? 'block' : 'none'}}>
					<Divider variant="inset" component="li" />

					<GeolocationItem></GeolocationItem>

					<RecentItems></RecentItems>

					<ResultItems></ResultItems>

				</List>

			</List>

		</Box>

	)

}