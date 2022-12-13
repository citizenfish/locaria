import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import Button from "@mui/material/Button";
import {setBbox} from "../../redux/slices/searchDrawerSlice";
import TypographyHeader from "../typography/typographyHeader";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import {useHistory} from "react-router-dom";
import {encodeSearchParams} from "libs/searchParams";
import MaplibreGL from "../maps/maplibreGL";
import FilterLayoutSubCats from "widgets/search/layouts/filterLayoutSubCats";

const SearchLocationFiltersMap = ({
								   category,
								   sx,
									page
							   }) => {
	const dispatch = useDispatch()
	const searchParams = useSelector((state) => state.searchDraw.searchParams);
	const mapRef = useRef();

	const features = useSelector((state) => state.searchDraw.features);
	const [expanded, setExpanded] = useState(false);
	const mobile = useSelector((state) => state.mediaSlice.mobile);
	const history = useHistory();



	function bboxUpdate(bbox) {
			dispatch(setBbox(bbox));
	}

	useEffect(() => {
		if(features&&features.type)
			mapRef.current.addGeojson(features,'data');
	},[features]);

	function toggleMap() {

		// Get current map location
		let mapLocation=mapRef.current.getLocation();

		let encodedPage = `/${page}/sp/${searchParams.categories}` + encodeSearchParams({

			// Reset our search location to current map location

			location: [mapLocation.lng,mapLocation.lat],
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


	function FiltersInner() {
		return (
			<>
				<Box textAlign='center'>
					{page&&
						<Button variant={"outlined"} onClick={()=>{toggleMap();handleChange();}} startIcon={<FormatAlignJustifyIcon/>}>Close Map</Button>
					}
				</Box>
				<FilterLayoutSubCats category={category}/>
			</>
		)
	}

	let  actualSx= {
		...{
			marginTop: "10px"

		}, ...sx? sx:{}
	};

		if (mobile === true) {
			return (
				<Box sx={actualSx} key={"SearchLocationFilters"}>
					<Grid container spacing={2} sx={{
						flexGrow: 1
					}}>
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
							<MaplibreGL  ref={mapRef} bboxUpdate={bboxUpdate}/>
						</Grid>

					</Grid>
				</Box>
			);
		} else {
			return (
				<Box sx={actualSx} key={"SearchLocationFilters"}>
					<Grid container spacing={2} sx={{
						flexGrow: 1
					}}>
						<Grid item md={3} sx={{width: "100%"}}>
							<FiltersInner/>
						</Grid>
						<Grid item md={9} sx={{width: "100%"}}>
							<MaplibreGL  ref={mapRef} bboxUpdate={bboxUpdate} bboxSet={searchParams.bbox} maxZoom={17} minZoom={12} pitch={60}/>
						</Grid>
					</Grid>
				</Box>
			);
		}

}

export default SearchLocationFiltersMap;