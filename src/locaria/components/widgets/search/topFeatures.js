import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import BigCard from "../featureCards/bigCard";
import {useDispatch, useSelector} from "react-redux";
import {setSearch} from "../../redux/slices/searchDrawerSlice";


const TopFeatures = ({category, limit, tags, sx, sxArray,resetSearch}) => {
	const dispatch = useDispatch()

	const search = useSelector((state) => state.searchDraw.search);

	if(resetSearch===true) {
		dispatch(setSearch(''));
	}
	const [results, setResults] = useState(undefined);
	let sxId = 0;

	useEffect(() => {
		window.websocket.registerQueue("topFeatures", function (json) {
			setResults(json.packet.geojson.features);
		});

		let packetSearch = {
			"queue": "topFeatures",
			"api": "api",
			"data": {
				"method": "search",
				"category": category,
				"search_text": search,
				"limit": limit

			}
		};
		if (tags)
			packetSearch.data.tags = tags;
		window.websocket.send(packetSearch);

	}, [search]);

	function getSx() {
		if (sxArray) {
			let ret = sxArray[sxId]
			sxId++;
			if(sxId>=sxArray.length)
				sxId=0;
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