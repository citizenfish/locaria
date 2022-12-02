import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import DataCard from "../featureCards/dataCard";
import SearchSubCategory from "./searchSubCategory";
import SearchDistance from "./searchDistance";
import SearchTags from "./searchTags";
import SearchPagination from "./searchPagination";
import {Accordion, AccordionDetails, AccordionSummary, LinearProgress, Stack} from "@mui/material";
import Button from "@mui/material/Button";
import TypographyHeader from "../typography/typographyHeader";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MapIcon from '@mui/icons-material/Map';
import {encodeSearchParams} from "../../../libs/searchParams";
import {useHistory} from "react-router-dom";
import SearchCheckboxFilter from "./searchCheckboxFilter";
import SearchLocationFiltersNoResults from "./searchLocationFiltersNoResults";
import {locationPopup} from "../../redux/slices/searchDrawerSlice";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddCardIcon from '@mui/icons-material/AddCard';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import TodayIcon from '@mui/icons-material/Today';

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

	const currentLocation = useSelector((state) => state.searchDraw.currentLocation);

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
				return (<SearchLocationFiltersNoResults/>)
			}
		}
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
					<Button variant={"outlined"} onClick={() => {
						toggleMap();
						handleChange();
					}} startIcon={<MapIcon/>}></Button>

				</Stack>
				<SearchDistance category={category}></SearchDistance>
				<SearchCheckboxFilter values={[{
					filter: true,
					path: "data.free",
					icon: <AddCardIcon/>,
					checkedIcon: <CreditCardOffIcon/>,
					counts: "free"
				}]}/>

				<SearchCheckboxFilter formatter={"stack"} values={[
					{icon: <TodayIcon/>,
						checkedIcon: <TodayIcon/>,
						name: "Su",
						filter: "true",
						path: "data.days.Sunday",
						counts:"days.Sunday"

					},
					{
					icon: <TodayIcon/>,
					checkedIcon: <TodayIcon/>,
					name: "M",
					filter: "true",
					path: "data.days.Monday",
					counts:"days.Monday"
				}, {
					icon: <TodayIcon/>,
					checkedIcon: <TodayIcon/>, name: "T", filter: "true", path: "data.days.Tuesday",
					counts:"days.Tuesday"

				}, {
					icon: <TodayIcon/>,
					checkedIcon: <TodayIcon/>,
					name: "W",
					filter: "true",
					path: "data.days.Wednesday",
					counts:"days.Wednesday"

				}, {
					icon: <TodayIcon/>,
					checkedIcon: <TodayIcon/>, name: "Th", filter: "true", path: "data.days.Thursday",
					counts:"days.Thursday"

				}, {icon: <TodayIcon/>,
					checkedIcon: <TodayIcon/>,
					name: "F",
					filter: "true",
					path: "data.days.Friday",
					counts:"days.Friday"

				}, {
					icon: <TodayIcon/>,
					checkedIcon: <TodayIcon/>, name: "Sa", filter: "true", path: "data.days.Saturday",
					counts:"days.Saturday"

				}]}/>

				<SearchSubCategory category={category}></SearchSubCategory>
				<SearchTags category={category}></SearchTags>

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
			<Grid container spacing={2} key={"SearchLocationFilters"} sx={actualSx}>
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