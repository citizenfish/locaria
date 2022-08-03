import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import {useParams} from "react-router-dom";
import TokenCheck from "../components/utils/tokenCheck";
import {useCookies} from "react-cookie";
import {openEditDrawer, setEditData} from "../../../../deprecated/editDrawerSlice";
import {DataGrid} from "@mui/x-data-grid";
import {openEditFeatureDrawer, setEditFeatureData} from "../../../../deprecated/editFeatureDrawerSlice";
import {setFeature} from "../redux/slices/adminPagesSlice";
import {useDispatch, useSelector} from "react-redux";
import {setTotal} from "../../../../deprecated/adminSlice";



export default function AdminContentDataEdit() {


	const [cookies, setCookies] = useCookies(['location']);
	const feature = useSelector((state) => state.adminPages.feature);

	const dispatch = useDispatch()



	useEffect(() => {
		window.websocket.registerQueue("viewLoader", function (json) {
			if (json.packet.response_code !== 200) {
				dispatch(setEditFeatureData({}));
			} else {
				dispatch(setEditFeatureData(json.packet));
			/*	mapRef.current.addGeojson(json.packet)
				mapRef.current.zoomToLayersExtent(["data"], 50000)*/
			}
		});

		if(feature) {
			window.websocket.send({
				"queue": "viewLoader",
				"api": "api",
				"data": {"method": "get_item", "fid": feature, "live": true}
			});
		}



		window.websocket.registerQueue("saveFeature", function (json) {

		});

		window.websocket.registerQueue("deleteFeature", function (json) {

		});

	}, [feature])



	return (
		<Box sx={{display: 'flex'}}>
			<TokenCheck></TokenCheck>
			<AdminAppBar title={`Content - Data`}/>
			<LeftNav isOpenContent={true}/>
			<Box
				component="main"
				sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '40px'}}
			>
				<h1>Edit feature</h1>



			</Box>
		</Box>
	)
}