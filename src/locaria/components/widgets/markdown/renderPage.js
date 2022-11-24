import React, {useEffect} from 'react';
import RenderMarkdown from "./renderMarkdown";
import {LinearProgress, useMediaQuery} from "@mui/material";
import {useHistory, useParams} from "react-router-dom";
import {setReport} from "../../redux/slices/viewDrawerSlice";
import {useDispatch, useSelector} from "react-redux";
import Box from "@mui/material/Box";
import MenuDrawer from "../drawers/menuDrawer";
import {setMobile} from "../../redux/slices/mediaSlice";
import {useCookies} from "react-cookie";
import {newSearch} from "../../redux/slices/searchDrawerSlice";
import SearchProxy from "../search/searchProxy";
import {decodeSearchParams} from "../../../libs/searchParams";

export default function RenderPage({searchMode}) {

	const dispatch = useDispatch()
	const history = useHistory();

	let {category} = useParams();
	let {search} = useParams();
	let {page} = useParams();
	let {feature} = useParams();
	const [render, setRender] = React.useState(0);
	const pageData = React.useRef(undefined);
	const pageActual = React.useRef(undefined);
	const channel = React.useRef(undefined);
	const [cookies, setCookies] = useCookies();


	function handleResize()  {
		dispatch(setMobile(!useMediaQuery('(min-width:900px)')));
	}

	window.addEventListener('resize', handleResize);

	handleResize();


	React.useEffect(() => {

		if (category)
			channel.current = window.systemCategories.getChannelProperties(category);


		let hash = window.location.hash;

		pageActual.current=page||'Home';
		if (hash&&hash.match(/#preview/)) {
			pageActual.current=`${page}-${cookies['id_token']}`;
		}
		if(searchMode===true) {
			let searchParams=decodeSearchParams(search);
			searchParams.categories=category;
			searchParams.rewrite=true;
			dispatch(newSearch(searchParams));
		}

		if(page!==undefined)
			setCookies('last', page, {path: '/', sameSite: true});

		window.websocket.registerQueue('pageBulkLoader', (json) => {
			if(json.getPageData.packet.error) {
				history.push("/");
			} else {
				pageData.current=json.getPageData.packet.parameters[pageActual.current].data;
				//setPageData(json.getPageData.packet.parameters[pageActual].data);
				dispatch(setReport(json));
				setRender(render+1);
				document.title = pageData.current.title;
			}
		});


		pageData.current=undefined;
		getAllData();

		return () => {
			pageData.current=undefined;
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
					"id_token": cookies['id_token']
				}
			}
		);

		if (feature) {
			if(feature.match(/^\@/)) {
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


	if(pageData.current&&pageData.current.data) {
		return (
			<Box sx={{
				display: "flex",
				alignItems: "center",
				width: "100%"

			}}>
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
			</Box>
		)
	} else {
		return (<LinearProgress></LinearProgress>)
	}
}