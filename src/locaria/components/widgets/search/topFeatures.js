import React, {useEffect, useRef, useState} from 'react';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import BigCard from "../featureCards/bigCard";
import {useDispatch, useSelector} from "react-redux";
import {clearRefresh, newSearch, setSearch} from "../../redux/slices/searchDrawerSlice";


const TopFeatures = ({id, category, limit, tags, sx, sxArray}) => {

	const dispatch = useDispatch();
	const search = useSelector((state) => state.searchDraw.search);
	const categories = useSelector((state) => state.searchDraw.categories);
	const refresh = useSelector((state) => state.searchDraw.refresh);

	const [results, setResults] = useState(undefined);
	const [searchId, setSearchId] = useState(undefined);
	let sxId = 0;



	useEffect(() => {
		if (id !== searchId) {
			setSearchId(id);
			dispatch(newSearch({categories: category}));
		}
	}, [id]);


	useEffect(() => {
		window.websocket.registerQueue("topFeatures", function (json) {
			setResults(json.packet.geojson.features);
		});


		if (refresh === true) {
			doSearch();
		}

	}, [refresh]);

	function doSearch() {
		let packetSearch = {
			"queue": "topFeatures",
			"api": "api",
			"data": {
				"method": "search",
				"category": categories,
				"search_text": search,
				"limit": limit

			}
		};
		if (tags)
			packetSearch.data.tags = tags;
		window.websocket.send(packetSearch);
		dispatch(clearRefresh());
	}

	function getSx() {
		if (sxArray) {
			let ret = sxArray[sxId]
			sxId++;
			if (sxId >= sxArray.length)
				sxId = 0;
			return ret;
		} else {
			return {};
		}
	}

	if (results === undefined) {
		return (<></>);
	} else {
		return (
			<Box sx={sx ? sx : {}}>
				<Grid container spacing={2} sx={{
					flexGrow: 1
				}}>
					{results.map((result) => {
						return (
							<Grid item md={3} key={result.properties.fid} sx={{
								width: "100%"
							}}>
								<BigCard sx={getSx()} feature={result}></BigCard>
							</Grid>
						)
					})}
				</Grid>
			</Box>
		);
	}
}

export default TopFeatures;