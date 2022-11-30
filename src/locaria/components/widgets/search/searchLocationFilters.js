import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import DataCard from "../featureCards/dataCard";
import SearchSubCategory from "./searchSubCategory";
import SearchDistance from "./searchDistance";
import SearchTags from "./searchTags";
import SearchPagination from "./searchPagination";
import {Accordion, AccordionDetails, AccordionSummary, LinearProgress} from "@mui/material";
import Button from "@mui/material/Button";
import TypographyHeader from "../typography/typographyHeader";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MapIcon from '@mui/icons-material/Map';
import {encodeSearchParams} from "../../../libs/searchParams";
import {useHistory} from "react-router-dom";
import SearchCheckboxFilter from "./searchCheckboxFilter";

const SearchLocationFilters = ({
								   category,
								   limit,
								   displayLimit,
								   tags,
								   sx,
								   field,
								   mode = 'full',
								   clickEnabled,
								   urlMode = true,
								   page
							   }) => {
	const dispatch = useDispatch()
	const searchParams = useSelector((state) => state.searchDraw.searchParams);
	const history = useHistory();

	const features = useSelector((state) => state.searchDraw.features);
	const loading = useSelector((state) => state.searchDraw.loading);
	const [expanded, setExpanded] = useState(false);
	const mobile = useSelector((state) => state.mediaSlice.mobile);

	function toggleMap() {
		let encodedPage = `/${page}/sp/${searchParams.categories}` + encodeSearchParams({
			location: searchParams.location,
			subCategories: searchParams.subCategories,
			distance: searchParams.distance,
			tags: searchParams.tags,
			page: searchParams.page,
			search: searchParams.search
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
				return (
					features.features.map((result) => {
							return (
								<DataCard feature={result} field={field} clickEnabled={clickEnabled} sx={{
									border: "1px solid #AAA",
									margin: "5px"
								}}></DataCard>
							)
						}
					)
				)

			} else {
				return <p>No results</p>
			}
		}
	}

	function FiltersInner() {
		return (
			<>
				<Box textAlign='center'>
					<Button variant={"outlined"} onClick={() => {
						toggleMap();
						handleChange();
					}} startIcon={<MapIcon/>}>Map</Button>
				</Box>
				<SearchDistance category={category}></SearchDistance>
				<SearchSubCategory category={category}></SearchSubCategory>
				<SearchTags category={category}></SearchTags>
				<SearchCheckboxFilter title={"Paid"} values={[{name: "Free", filter: true, path: "data.free"}]}/>
				<SearchCheckboxFilter title={"Days"} values={[{name: "Monday", filter: true, path: "data.days.Monday"}, {name: "Tuesday", filter: true, path: "data.days.Tuesday"},{name: "Wednesday", filter: true, path: "data.days.Wednesday"},{name: "Thursday", filter: true, path: "data.days.Thursday"},{name: "Friday", filter: true, path: "data.days.Friday"},{name: "Saturday", filter: true, path: "data.days.Saturday"},{name: "Sunday", filter: true, path: "data.days.Sunday"}]}/>
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
				<Grid container spacing={2} key={"SearchLocationFilters"} sx={actualSx} key={"SearchLocationFilters"}>

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
						<ResultItems></ResultItems>
						<SearchPagination></SearchPagination>
					</Grid>

				</Grid>
		);
	} else {
		return (
				<Grid container spacing={2} key={"SearchLocationFilters"} sx={actualSx} >
					<Grid item md={3} sx={{width: "100%"}}>
						<FiltersInner/>
					</Grid>
					<Grid item md={9} sx={{width: "100%"}}>
						<ResultItems></ResultItems>
						<SearchPagination></SearchPagination>
					</Grid>
				</Grid>
		);
	}
}

export default SearchLocationFilters;