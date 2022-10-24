import React, {useState} from "react";
import {Backdrop, Dialog, DialogTitle, ListItem, ListItemText, TextField} from "@mui/material";
import List from "@mui/material/List";
import {useDispatch, useSelector} from "react-redux";
import {locationPopup} from "../../redux/slices/searchDrawerSlice";
import {useHistory} from "react-router-dom";
import Box from "@mui/material/Box";

export default function SearchLocationPopup({isOpen = false}) {
	const dispatch = useDispatch();
	const history = useHistory();

	const open = useSelector((state) => state.searchDraw.locationOpen);
	const page = useSelector((state) => state.searchDraw.locationPage);

	const [cookieResults, setCookieResults] = useState([{"name": "Swindon"}]);
	const [results, setResults] = useState([]);

	function handleClose() {
		dispatch(locationPopup({open: false}));

	}

	function handleListItemClick() {
		history.push(page);
		dispatch(locationPopup({open: false}));
	}

	return (
		<Box sx={{
			position: "absolute",
			top: "50%"
		}}>

			<List sx={{pt: 0, zIndex: 101}}>
				<ListItem button>
					<TextField sx={{background: "#fff"}} id={"locationSearchText"} onClick={() => {
						dispatch(locationPopup({open: true}));
					}}></TextField>
				</ListItem>
				<Backdrop open={open} sx={{zIndex: 100}}>

					<List sx={{pt: 0, display: open ? 'block' : 'none', zIndex: 102}}>
						{cookieResults.map((cookieResult) => (
							<ListItem button onClick={() => handleListItemClick(cookieResult.name)}
									  key={cookieResult.name}>
								<ListItemText primary={cookieResult.name}/>
							</ListItem>
						))}
					</List>
				</Backdrop>

			</List>

		</Box>
	)

}