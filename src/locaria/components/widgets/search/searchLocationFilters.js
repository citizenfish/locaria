import React, {useEffect} from 'react';
import {newSearch} from "../../redux/slices/searchDrawerSlice";
import {useDispatch, useSelector} from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import SearchCategory from "./searchCategory";
import DataCard from "../featureCards/dataCard";


const SearchLocationFilters = ({id, category, limit, displayLimit, tags, sx,field}) => {

	const dispatch = useDispatch();
	const features = useSelector((state) => state.searchDraw.features);


	useEffect(() => {
		dispatch(newSearch({categories: category, tags: tags, limit: limit, displayLimit: displayLimit}));
	}, []);

	function ResultItems() {
		if(features&&features.features) {
			return (
				features.features.map((result) => {
						return (
							<DataCard feature={result} field={field}></DataCard>
						)
					}
				)
			)
		} else {
			return <p>No results</p>
		}
	}

	return (
		<Box sx={sx ? sx : {}} key={"SearchLocationFilters"}>
			<Grid container spacing={2} sx={{
				flexGrow: 1
			}}>

				<Grid item md={3} sx={{width: "100%"}}>
					<SearchCategory category={category}></SearchCategory>
				</Grid>
				<Grid item md={9} sx={{width: "100%"}}>
					<ResultItems></ResultItems>
				</Grid>

			</Grid>
		</Box>
	);
}

export default SearchLocationFilters;