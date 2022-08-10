import React, {useEffect, useRef, useState} from 'react';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import BigCard from "../featureCards/bigCard";
import {useDispatch, useSelector} from "react-redux";
import {clearRefresh, newSearch, setSearch} from "../../redux/slices/searchDrawerSlice";


const TopFeatures = ({id, category, limit, displayLimit, tags, sx, sxArray, rankingAttributes}) => {

	const dispatch = useDispatch();
	const search = useSelector((state) => state.searchDraw.search);
	const categories = useSelector((state) => state.searchDraw.categories);
	const actualTags = useSelector((state) => state.searchDraw.tags);
	const refresh = useSelector((state) => state.searchDraw.refresh);

	const [results, setResults] = useState(undefined);
	const [searchId, setSearchId] = useState(undefined);
	let sxId = 0;


	useEffect(() => {
		if (id&&id !== searchId) {
			setSearchId(id);
			dispatch(newSearch({categories: category, tags: tags}));
		}
	}, [id]);


	useEffect(() => {
		window.websocket.registerQueue("topFeatures", function (json) {
			setResults(json.packet.geojson.features);
		});


		if (refresh === true) {
			doSearch();
		}

		return () => {
			window.websocket.removeQueue("topFeatures");
		}

	}, [refresh]);

	function doSearch() {
		let packetSearch = {
			"queue": "topFeatures",
			"api": "api",
			"data": {
				"method": "search",
				"category": categories,
				"search_text": search

			}
		};
		if (displayLimit)
			packetSearch.data['display_limit'] = displayLimit;
		if (limit)
			packetSearch.data['limit'] = limit;

		if (rankingAttributes)
			packetSearch.data['ranking_attributes'] = rankingAttributes;
		if (actualTags.length > 0)
			packetSearch.data.tags = actualTags;
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
			<Box sx={sx ? sx : {}} key={"topFeatures"}>
				<Grid container spacing={4} sx={{
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