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
import SimpleMap from "../maps/simpleMap";
import {setDisplayLimit} from "../../redux/slices/searchDrawerSlice";
import TypographyHeader from "../typography/typographyHeader";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const SearchLocationFilters = ({
								   category,
								   limit,
								   displayLimit,
								   tags,
								   sx,
								   field,
								   mode = 'full',
								   clickEnabled,
								   urlMode = true
							   }) => {
	const dispatch = useDispatch()

	const features = useSelector((state) => state.searchDraw.features);
	const loading = useSelector((state) => state.searchDraw.loading);
	const [mapView, setMapView] = useState(false);
	const mobile = useSelector((state) => state.mediaSlice.mobile);

	function toggleMap() {
		setMapView(!mapView);
		if (mapView === true) {
			dispatch(setDisplayLimit(20))
		} else {
			dispatch(setDisplayLimit(1000))
		}

	}


	function ResultItems() {

		if (mapView === true) {
			return (
				<SimpleMap></SimpleMap>
			)
		} else {
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
	}

	if (mode === 'full') {
		if (mobile === true) {
			return (
				<Box sx={sx ? sx : {}} key={"SearchLocationFilters"}>
					<Grid container spacing={2} sx={{
						flexGrow: 1
					}}>
						<Grid item md={3} sx={{width: "100%"}}>

							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon/>}
									aria-controls="panel1a-content"
									id="panel1a-header"
								>
									<TypographyHeader element={"h1"}>Filters</TypographyHeader>
								</AccordionSummary>
								<AccordionDetails>

									{mapView === true &&
										<Button onClick={toggleMap}>Close Map</Button>
									}
									{mapView === false &&
										<Button onClick={toggleMap}>Map</Button>
									}
									<SearchDistance category={category}></SearchDistance>
									<SearchSubCategory category={category}></SearchSubCategory>
									<SearchTags category={category}></SearchTags>

								</AccordionDetails>
							</Accordion>

						</Grid>
						<Grid item md={9} sx={{width: "100%"}}>
							<ResultItems></ResultItems>
							<SearchPagination></SearchPagination>
						</Grid>

					</Grid>
				</Box>
			);
		} else {
			return (
				<Box sx={sx ? sx : {}} key={"SearchLocationFilters"}>
					<Grid container spacing={2} sx={{
						flexGrow: 1
					}}>
						<Grid item md={3} sx={{width: "100%"}}>
							{mapView === true &&
								<Button onClick={toggleMap}>Close Map</Button>
							}
							{mapView === false &&
								<Button onClick={toggleMap}>Map</Button>
							}
							<SearchDistance category={category}></SearchDistance>
							<SearchSubCategory category={category}></SearchSubCategory>
							<SearchTags category={category}></SearchTags>
						</Grid>
						<Grid item md={9} sx={{width: "100%"}}>
							<ResultItems></ResultItems>
							<SearchPagination></SearchPagination>
						</Grid>

					</Grid>
				</Box>
			);
		}
	} else {
		return (
			<Box id={"locationSearchTopLevel"} sx={sx ? sx : {}} key={"SearchLocationFilters"}>
				<Grid container spacing={2} sx={{
					flexGrow: 1
				}}>
					<Grid item md={12} sx={{width: "100%"}}>
						<ResultItems></ResultItems>
					</Grid>
				</Grid>
			</Box>
		);
	}
}

export default SearchLocationFilters;