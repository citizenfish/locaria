import React, {useEffect, useRef, useState} from 'react';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import BigCard from "../featureCards/bigCard";
import {useDispatch, useSelector} from "react-redux";
import {newSearch} from "../../redux/slices/searchDrawerSlice";


const TopFeatures = ({id, category, limit, displayLimit, tags, sx, sxArray, rankingAttributes,rewrite=false,forceSearch=false}) => {

	const dispatch = useDispatch();
	const features = useSelector((state) => state.searchDraw.features);

	let sxId = 0;

	const [mounted,setMounted]=useState(0);

	useEffect(() => {
		if(mounted===0&&forceSearch===true) {
			setMounted(mounted+1);
			dispatch(newSearch({categories: category, tags: tags, limit:limit,displayLimit:displayLimit,rewrite:rewrite }));
		}


	},[mounted]);

	useEffect(() => {
		return function () {
		}
	},[]);


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

	if (features === undefined || features.features === undefined) {
		return (<></>);
	} else {
		return (
			<Box sx={sx ? sx : {}} key={"topFeatures"}>
				<Grid container spacing={4} sx={{
					flexGrow: 1
				}}>
					{features.features.map((result) => {
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