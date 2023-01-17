import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Grid from "@mui/material/Grid";
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
import TextSearchSimple from "widgets/search/TextSearchSimple";
import FooterBackToTop from "widgets/footers/footerBackToTop";
import ShoppingBasket from "widgets/basket/shoppingBasket";
import SearchRecommended from "widgets/search/searchRecommended";
import FilterLayoutDays from "widgets/search/layouts/filterLayoutDays";
import {FieldView} from "widgets/data/fieldView";
import {v4} from "uuid";
import Box from "@mui/material/Box";

const SearchLocationFilters = ({
								   category,
								   sx,
								   field,
								   page
							   }) => {
	const dispatch = useDispatch();
	const searchParams = useSelector((state) => state.searchDraw.searchParams);
	const resultBbox = useSelector((state) => state.searchDraw.resultBbox);
	const history = useHistory();

	const features = useSelector((state) => state.searchDraw.features);
	const loading = useSelector((state) => state.searchDraw.loading);
	const [expanded, setExpanded] = useState(false);
	const [advanced, setAdvanced] = useState(false);
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

	function handleChangeAdvanced() {
		setAdvanced(!advanced);
	}

	function ResultItems() {
		if (loading === true) {
			return (
				<LinearProgress/>
			)
		} else {
			if (features && features.features && features.features.length > 0) {

				return (
					features.features.map((result) => {
							return (
								<FieldView data={result} mode={"read"} fields={field} key={v4()}></FieldView>
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
			<Stack direction="column" spacing={2}>
				<Stack direction="row" spacing={2}>
					<SearchRecommended/>
					<ShoppingBasket/>
				</Stack>
				<Accordion expanded={advanced} onChange={handleChangeAdvanced}>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon/>}
						aria-controls="panel1a-content"
						id="panel1a-header"
					>
						<TypographyHeader sx={{"color": "#1976d2","fontSize": "0.9rem"}} element={"h2"}>Advanced</TypographyHeader>
					</AccordionSummary>
					<AccordionDetails>
						<Stack direction="row" spacing={2}>
							<Button variant={"outlined"} sx={{
								width: "100%"
							}} onClick={() => {
								dispatch(locationPopup({open: true}));
							}} startIcon={
								<EditLocationAltIcon/>}>{currentLocation ? currentLocation.text.substring(0, 10) + (currentLocation.text.length > 10 ? '...' : '') : 'No location'}</Button>
							{page &&
								<Button variant={"outlined"} sx={{width: "80px"}} onClick={() => {
									toggleMap();
									handleChange();
								}} startIcon={<MapIcon sx={{marginLeft: "12px"}}/>}></Button>
							}

						</Stack>
						<SearchDistance category={category}></SearchDistance>
						<TextSearchSimple/>
						<FilterLayoutDays/>
					</AccordionDetails>
				</Accordion>
				<FilterLayoutSubCats category={category}/>
			</Stack>
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
			<>
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
					<Grid item md={9} xs={12} sx={{width: "100%"}} alignItems={"center"} justifyContent={"space-evenly"}>
						<ResultsInner/>
					</Grid>

				</Grid>
				<FooterBackToTop/>
			</>
		);
	} else {
		return (
			<Box key={v4()}>
				<Grid container spacing={2} key={v4()} sx={actualSx}>
					<Grid item md={3} sx={{width: "100%"}}>
						<FiltersInner/>
					</Grid>
					<Grid item md={9} sx={{width: "100%"}}>
						<ResultsInner/>
					</Grid>
				</Grid>
				<FooterBackToTop/>
			</Box>
		);
	}
}

export default SearchLocationFilters;