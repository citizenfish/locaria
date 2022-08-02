import {useDispatch, useSelector} from "react-redux";
import {useCookies} from "react-cookie";
import React, {useEffect} from "react";
import {setPage, setPages} from "../../redux/slices/adminPagesSlice";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import {InputLabel, Select} from "@mui/material";

export default function PageSelector() {

	const page = useSelector((state) => state.adminPages.page);
	const pages = useSelector((state) => state.adminPages.pages);
	const dispatch = useDispatch()

	const [cookies, setCookies] = useCookies(['location']);

	useEffect(() => {
		window.websocket.registerQueue('getPages', (json) => {
			if (json.packet)
				dispatch(setPages(json.packet.parameters));
			else
				dispatch(setPages({}));
		});
		if(pages===undefined)
			getPages();
	},[pages]);

	const getPages = () => {
		window.websocket.send({
			"queue": "getPages",
			"api": "sapi",
			"data": {
				"method": "get_parameters",
				"usage": "Page",
				"delete_key":"data",
				id_token: cookies['id_token'],

			}
		});
	}

	let pageList = [];
	for(let p in pages) {
		pageList.push( <MenuItem key={p} value={p}>{p} - {pages[p].title}</MenuItem>)
	}

	return (
		<FormControl fullWidth>
			<InputLabel id="demo-simple-select-label">Edit Page</InputLabel>
			<Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				value={page}
				label="Page"
				onChange={(e) => {
					dispatch(setPage(e.target.value));
				}}
			>
				{pageList}
			</Select>
		</FormControl>
	)
}