import React, {useEffect, useState} from "react";
import {Backdrop, Dialog, DialogTitle, ListItem, ListItemIcon, ListItemText, TextField} from "@mui/material";
import List from "@mui/material/List";
import {useDispatch, useSelector} from "react-redux";
import {locationPopup, setGeolocation} from "../../redux/slices/searchDrawerSlice";
import {useHistory} from "react-router-dom";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import NearMeIcon from '@mui/icons-material/NearMe';
import PlaceIcon from '@mui/icons-material/Place';
import {setupField} from "../../redux/slices/formSlice";
import {getLocation} from "../../../libs/geolocation";

export default function SearchLocationPopup({defaultPage}) {
	const dispatch = useDispatch();
	const history = useHistory();

	const open = useSelector((state) => state.searchDraw.locationOpen);
	const page = useSelector((state) => state.searchDraw.locationPage);
	const geolocation = useSelector((state) => state.searchDraw.geolocation);

	const [cookieResults, setCookieResults] = useState([{"name": "Swindon"}]);
	const [results, setResults] = useState([]);

	function handleClose() {
		dispatch(locationPopup({open: false, page: page}));

	}

	function handleListItemClick() {
		history.push(page);
		dispatch(locationPopup({open: false}));
	}


	function handleGeoSuccess(location) {
		dispatch(setGeolocation(location));
	}

	function handleGeoError(location) {
		dispatch(setGeolocation(false));
	}

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
			<ListItem button onClick={() => handleListItemClick("Nearby", geolocation)}
					  key={"Nearby"}>
				<ListItemIcon>
					<NearMeIcon/>
				</ListItemIcon>
				<ListItemText primary={`Nearby ${geolocation[0]},${geolocation[1]}`}/>
			</ListItem>
		)

	}

	return (


		<Box sx={{
			position: "absolute",
			top: "calc( 50% - 100px )",
			left: "calc( 50% - 400px )",
			width: "800px",
		}}>
			<Backdrop open={open} sx={{zIndex: 100}} onClick={handleClose}>
			</Backdrop>

			<List sx={{pt: 0, zIndex: 101, background: '#fff', borderRadius: "12px"}}>
				<ListItem button>
					<TextField sx={{background: "#fff"}} id={"locationSearchText"} onClick={() => {
						dispatch(locationPopup({open: true, page: defaultPage}));
					}}></TextField>
				</ListItem>
				<List sx={{pt: 0, display: open ? 'block' : 'none'}}>
					<Divider></Divider>

					<GeolocationItem></GeolocationItem>

					{cookieResults.map((cookieResult) => (
						<ListItem button onClick={() => handleListItemClick(cookieResult.name, [0, 0])}
								  key={cookieResult.name}>
							<ListItemIcon>
								<PlaceIcon/>
							</ListItemIcon>
							<ListItemText primary={cookieResult.name}/>
						</ListItem>
					))}

				</List>

			</List>

		</Box>

	)

}