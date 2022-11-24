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
import MapIcon from '@mui/icons-material/Map';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import {useHistory} from "react-router-dom";
import {encodeSearchParams} from "../../../libs/searchParams";

const SearchLocationFiltersMap = ({
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

	const features = useSelector((state) => state.searchDraw.features);
	const loading = useSelector((state) => state.searchDraw.loading);
	const [expanded, setExpanded] = useState(false);
	const mobile = useSelector((state) => state.mediaSlice.mobile);
	const history = useHistory();

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


	function FiltersInner() {
		return (
			<>
				<Box textAlign='center'>
					<Button variant={"outlined"} onClick={()=>{toggleMap();handleChange();}} startIcon={<FormatAlignJustifyIcon/>}>Close Map</Button>
				</Box>
				<SearchSubCategory category={category}></SearchSubCategory>
				<SearchTags category={category}></SearchTags>
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
							<SimpleMap/>
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
							<SimpleMap/>
						</Grid>
					</Grid>
				</Box>
			);
		}

}

export default SearchLocationFiltersMap;