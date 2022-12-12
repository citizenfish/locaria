import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Grid from "@mui/material/Grid";
import DataCard from "../featureCards/dataCard";
import SearchDistance from "./searchDistance";
import SearchPagination from "./searchPagination";
import {Accordion, AccordionDetails, AccordionSummary, LinearProgress, Stack} from "@mui/material";
import Button from "@mui/material/Button";
import TypographyHeader from "../typography/typographyHeader";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MapIcon from '@mui/icons-material/Map';
import {encodeSearchParams} from "libs/searchParams";
import {useHistory} from "react-router-dom";
import SearchLocationFiltersNoResults from "./searchLocationFiltersNoResults";
import {locationPopup} from "../../redux/slices/searchDrawerSlice";
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';

import FilterLayoutSubCats from "widgets/search/layouts/filterLayoutSubCats";
import {v4 as uuidv4} from "uuid";
import TextSearchSimple from "widgets/search/TextSearchSimple";

const SearchLocationFilters = ({
								   category,
								   sx,
								   field,
								   clickEnabled,
								   page
							   }) => {
	const dispatch = useDispatch()
	const searchParams = useSelector((state) => state.searchDraw.searchParams);
	const resultBbox = useSelector((state) => state.searchDraw.resultBbox);
	const history = useHistory();

	const features = useSelector((state) => state.searchDraw.features);
	const loading = useSelector((state) => state.searchDraw.loading);
	const [expanded, setExpanded] = useState(false);
	const mobile = useSelector((state) => state.mediaSlice.mobile);

	const currentLocation = useSelector((state) => state.searchDraw.currentLocation);

	function toggleMap() {
		let encodedPage = `/${page}/sp/${searchParams.categories}` + encodeSearchParams({
			location: searchParams.location,
			subCategories: searchParams.subCategories,
			distance: searchParams.distance,
			tags: searchParams.tags,
			page: searchParams.page,
			search: searchParams.search,
			bbox: resultBbox,
			wait: true
		});
		history.push(encodedPage);
	}

	function handleChange() {
		setExpanded(!expanded);
	}


	function ResultItems() {
		if (loading === true) {
			return (
				<LinearProgress/>
			)
		} else {
			if (features && features.features && features.features.length > 0) {

				let mobileHeight=(mobile? '500px':'210px');
				return (
					features.features.map((result) => {
							return (
								<DataCard key={uuidv4()} feature={result} field={field} clickEnabled={clickEnabled} sx={{
									//TODO move into config
									borderRadius: "5px",
									border: "1px solid rgb(228, 230, 230)",
									margin: "5px",
									backgroundColor:"rgba(218, 210, 210, 0.03)",
									height: mobileHeight
								}}></DataCard>
							)
						}
					)
				)

			} else {
				return (<SearchLocationFiltersNoResults/>)
			}
		}
	}

	function ResultsInner() {
		return (
			<>
				<ResultItems></ResultItems>
				<SearchPagination></SearchPagination>
			</>
		)
	}

	function FiltersInner() {
		return (
			<>
				<Stack direction="row" spacing={2}>
					<Button variant={"outlined"} sx={{
						width: "70%"
					}} onClick={() => {
						dispatch(locationPopup({open: true}));
					}} startIcon={
						<EditLocationAltIcon/>}>{currentLocation ? currentLocation.text.substring(0, 10) + (currentLocation.text.length > 10 ? '...' : '') : 'No location'}</Button>
					{page&&
						<Button variant={"outlined"} onClick={() => {
							toggleMap();
							handleChange();
						}} startIcon={<MapIcon/>}></Button>
					}

				</Stack>
				<SearchDistance category={category}></SearchDistance>
				<TextSearchSimple/>
				<FilterLayoutSubCats category={category}/>
			</>
		)
	}

	let actualSx = {
		...{
			marginTop: "10px",
			flexGrow: 1

		}, ...sx ? sx : {}
	};
	if (mobile === true) {
		return (
			<Grid container spacing={2} key={"SearchLocationFilters"} sx={actualSx}>

				<Grid item md={3} sx={{width: "100%"}}>

					<Accordion expanded={expanded} onChange={handleChange}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon/>}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<TypographyHeader element={"h1"}>Filters</TypographyHeader>
						</AccordionSummary>
						<AccordionDetails>
							<FiltersInner/>
						</AccordionDetails>
					</Accordion>

				</Grid>
				<Grid item md={9} sx={{width: "100%"}}>
					<ResultsInner/>
				</Grid>

			</Grid>
		);
	} else {
		return (
			<Grid container spacing={2} key={"SearchLocationFilters"} sx={actualSx}>
				<Grid item md={3} sx={{width: "100%"}}>
					<FiltersInner/>
				</Grid>
				<Grid item md={9} sx={{width: "100%"}}>
					<ResultsInner/>
				</Grid>
			</Grid>
		);
	}
}

export default SearchLocationFilters;