import React from 'react';
import RenderMarkdown from "./renderMarkdown";
import {LinearProgress} from "@mui/material";
import {useParams} from "react-router-dom";
import {setReport} from "../../redux/slices/viewDrawerSlice";
import {useDispatch} from "react-redux";
import Box from "@mui/material/Box";
import MenuDrawer from "../drawers/menuDrawer";

export default function RenderPage() {

	const dispatch = useDispatch()

	let {category} = useParams();
	let {page} = useParams();
	let {feature} = useParams();
	const [pageData, setPageData] = React.useState(undefined);


	let channel;

	if (category)
		channel = window.systemCategories.getChannelProperties(category);


	const getAllData = () => {
		let bulkPackage = [];
		bulkPackage.push(
			{
				"queue": "getPageData",
				"api": "api",
				"data": {
					"method": "get_parameters",
					"parameter_name": page || 'Home'
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

		window.websocket.registerQueue('pageBulkLoader', (json) => {
			setPageData(json.getPageData.packet.parameters[page || 'Home']);
			dispatch(setReport(json));
		});

		getAllData();
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
					margin: "0 auto"

				}}>
					<RenderMarkdown markdown={pageData.data}/>
				</Box>
				<MenuDrawer></MenuDrawer>
			</Box>
		)
	} else {
		return (<LinearProgress></LinearProgress>)
	}
}