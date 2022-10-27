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
import {clearRefresh, newSearch, setFeatures} from "../../redux/slices/searchDrawerSlice";
import SearchProxy from "../search/searchProxy";
import {decodeSearchParams} from "../../../libs/searchParams";

export default function RenderPage({searchMode}) {

	const dispatch = useDispatch()
	const history = useHistory();

	let {category} = useParams();
	let {search} = useParams();
	let {page} = useParams();
	let {feature} = useParams();
	const [pageData, setPageData] = React.useState(undefined);
	const [cookies, setCookies] = useCookies(['id_token']);


	console.log(search);

	let hash = window.location.hash;

	let pageActual=page||'Home';
	if (hash&&hash.match(/#preview/)) {
		pageActual=`${page}-${cookies['id_token']}`;
	}


	const handleResize = () => {
		dispatch(setMobile(!useMediaQuery('(min-width:600px)')));
	};

	handleResize();

	let channel;

	if (category)
		channel = window.systemCategories.getChannelProperties(category);



	React.useEffect(() => {
		if(searchMode===true) {
			let searchParams=decodeSearchParams(search);
			searchParams.categories=category;
			//dispatch(newSearch({categories: category, tags: tags, limit: limit, displayLimit: displayLimit}));
			dispatch(newSearch(searchParams));

		}
	});

	const getAllData = () => {
		let bulkPackage = [];
		bulkPackage.push(
			{
				"queue": "getPageData",
				"api": "api",
				"data": {
					"method": "get_parameters",
					"parameter_name": pageActual,
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

		if (channel && channel.report) {
			bulkPackage.push(
				{
					"queue": "reportLoader",
					"api": "api",
					"data": {
						"method": "report",
						"report_name": channel.report,
						"fid": feature
					}
				}
			)
		}

		window.websocket.sendBulk('pageBulkLoader', bulkPackage);
	}





	React.useEffect(() => {
		if(page!==undefined)
			setCookies('last', page, {path: '/', sameSite: true});

		window.websocket.registerQueue('pageBulkLoader', (json) => {
			if(json.getPageData.packet.error) {
				history.push("/");
			} else {
				setPageData(json.getPageData.packet.parameters[pageActual].data);
				dispatch(setReport(json));
			}
		});



		getAllData();
		window.addEventListener('resize', handleResize);
	}, [page]);

	if (pageData) {
		document.title = pageData.title;
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
					<RenderMarkdown markdown={pageData.data} key={'mdTop'}/>
				</Box>
				<MenuDrawer></MenuDrawer>
			</Box>
		)
	} else {
		return (<LinearProgress></LinearProgress>)
	}
}