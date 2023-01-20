import React from 'react';
import RenderMarkdown from "./renderMarkdown";
import {LinearProgress, useMediaQuery} from "@mui/material";
import {useHistory, useParams} from "react-router-dom";
import {setReport} from "../../redux/slices/viewDrawerSlice";
import {useDispatch, useSelector} from "react-redux";
import Box from "@mui/material/Box";
import MenuDrawer from "../drawers/menuDrawer";
import {setMobile} from "../../redux/slices/mediaSlice";
import {newSearch, setCurrentLocation} from "../../redux/slices/searchDrawerSlice";
import SearchProxy from "../search/searchProxy";
import {decodeSearchParams} from "libs/searchParams";
import {reloadProfile, setSavedAttribute} from "components/redux/slices/userSlice";
import TokenCheck from "widgets/utils/tokenCheck";
import {reloadItems} from "components/redux/slices/basketSlice";

export default function RenderPage({searchMode}) {

	const dispatch = useDispatch()
	const history = useHistory();

	let {category} = useParams();
	let {search} = useParams();
	let {page} = useParams();
	let {feature} = useParams();
	let {shortCode} = useParams();
	const [render, setRender] = React.useState(0);
	const pageData = React.useRef(undefined);
	const pageActual = React.useRef(undefined);
	const channel = React.useRef(undefined);
	const currentLocation = useSelector((state) => state.userSlice.currentLocation);
	const lastPage = useSelector((state) => state.userSlice.lastPage);
	const idToken = useSelector((state) => state.userSlice.idToken);

	function handleResize()  {
		dispatch(setMobile(!useMediaQuery('(min-width:900px)')));
	}

	window.addEventListener('resize', handleResize);

	handleResize();

	React.useEffect(() => {

		dispatch(reloadProfile());
		dispatch(reloadItems());

		return () => {
			pageData.current=undefined;
		}
	},[]);

	React.useEffect(() => {

		pageActual.current=page||'Home';

		window.websocket.registerQueue('pageBulkLoader', (json) => {
			if(json.getPageData.packet.error) {
				history.push("/");
			} else {
				pageData.current=json.getPageData.packet.parameters[pageActual.current].data;
				//setPageData(json.getPageData.packet.parameters[pageActual].data);
				dispatch(setReport(json));
				setRender(render+1);
				document.title = pageData.current.title;
				
				if(pageActual.current&&page!==lastPage) {
					// This will cause re-render so we do it last
					dispatch(setSavedAttribute({attribute:"lastPage",value:page}));
				}
		
			}
		});

		pageData.current=undefined;
		if (category)
			channel.current = window.systemCategories.getChannelProperties(category);


		let hash = window.location.hash;

		if (hash&&hash.match(/#preview/)) {
			pageActual.current=`${page}-${idToken}`;
		}
		if(searchMode===true) {
			let searchParams=decodeSearchParams(search);
			searchParams.categories=category;
			searchParams.rewrite=true;
			dispatch(newSearch(searchParams));
		}

		
		


		pageData.current=undefined;
		getAllData();

		if(currentLocation===undefined) {
			dispatch(setCurrentLocation(currentLocation));
		}

		
	},[page]);

	

	const getAllData = () => {
		let bulkPackage = [];
		bulkPackage.push(
			{
				"queue": "getPageData",
				"api": "api",
				"data": {
					"method": "get_parameters",
					"parameter_name": pageActual.current,
					"id_token": idToken
				}
			}
		);

		if (feature) {
			if(feature.match(/^@/)) {
				bulkPackage.push(
					{
						"queue": "viewLoader",
						"api": "api",
						"data": {"method": "get_item", "_identifier": feature.replace(/@/,'')}
					}
				)
			} else {
				bulkPackage.push(
					{
						"queue": "viewLoader",
						"api": "api",
						"data": {"method": "get_item", "fid": feature}
					}
				)
			}
		}

		if(shortCode) {

			bulkPackage.push(
				{
					"queue": "viewLoader",
					"api": "api",
					"data": {"method": "search", "shortcode": shortCode}
				}
			)
		}

		if (channel.current && channel.current.report) {
			bulkPackage.push(
				{
					"queue": "reportLoader",
					"api": "api",
					"data": {
						"method": "report",
						"report_name": channel.current.report,
						"fid": feature
					}
				}
			)
		}

		window.websocket.sendBulk('pageBulkLoader', bulkPackage);
	}

	// Setup the default sx object
	const sx = {...{
			display: "flex",
			alignItems: "center",
			width: "100%"
		},...window.systemMain['defaultSX']

	}

	if(pageData.current&&pageData.current.data) {
		return (
			<Box sx={sx}>
				<Box sx={{
					padding: "10px",
					maxWidth: "1100px",
					margin: "0 auto",
					width: "100vw"

				}}>
					<SearchProxy></SearchProxy>
					<RenderMarkdown markdown={pageData.current.data} key={'mdTop'}/>
				</Box>
				<MenuDrawer></MenuDrawer>
				<TokenCheck/>
			</Box>
		)
	} else {
		return (<LinearProgress></LinearProgress>)
	}
}