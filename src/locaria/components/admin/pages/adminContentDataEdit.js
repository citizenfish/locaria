import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import {useHistory, useParams} from "react-router-dom";
import TokenCheck from "../components/utils/tokenCheck";
import {useCookies} from "react-cookie";
import {openEditDrawer, setEditData} from "../../../../deprecated/editDrawerSlice";
import {DataGrid} from "@mui/x-data-grid";
import {openEditFeatureDrawer, setEditFeatureData} from "../../../../deprecated/editFeatureDrawerSlice";
import {setFeature} from "../redux/slices/adminPagesSlice";
import {useDispatch, useSelector} from "react-redux";
import {setTotal} from "../../../../deprecated/adminSlice";
import {FieldView} from "../../widgets/data/fieldView";
import Button from "@mui/material/Button";
import MdSerialize from "../../../libs/mdSerialize";



export default function AdminContentDataEdit() {


	const [cookies, setCookies] = useCookies(['location']);
	const feature = useSelector((state) => state.adminPages.feature);
	const [featureData,setFeatureData]= useState(undefined)

	const dispatch = useDispatch();

	let {fid}=useParams();

	const history = useHistory();

	const MD = new MdSerialize();


	useEffect(() => {

		window.websocket.registerQueue("viewLoader", function (json) {
			if (json.packet.response_code !== 200) {
				dispatch(setEditFeatureData({}));
				setFeatureData({});
			} else {
				setFeatureData(json.packet.features[0].properties);
			/*	mapRef.current.addGeojson(json.packet)
				mapRef.current.zoomToLayersExtent(["data"], 50000)*/
			}
		});

		window.websocket.registerQueue("saveFeature", function (json) {
			history.push(`/Admin/Content/Data/`);
		});

		window.websocket.registerQueue("deleteFeature", function (json) {
			history.push(`/Admin/Content/Data/`);
		});

		if(feature) {
			window.websocket.send({
				"queue": "viewLoader",
				"api": "api",
				"data": {"method": "get_item", "fid": feature, "live": true, "id_token": cookies['id_token']}
			});
		} else {
			dispatch(setFeature(fid));
		}

	}, [feature])

	function deleteFeature() {
		window.websocket.send({
			"queue": "deleteFeature",
			"api": "sapi",
			"data": {
				"method": "delete_item", "fid": feature,
				"id_token": cookies['id_token']
			}
		});

	}

	function cancelFeature() {
		history.push(`/Admin/Content/Data/`);
	}

	function saveFeature() {
		let element=document.getElementById("data.description.text");
		let obj=MD.parseHTML(element);
		let packet={
			"queue": "saveFeature",
			"api": "sapi",
			"data": {
				"method": "update_item", "fid": feature, "attributes": {
					"description":{
						"text":obj
					},
				},
				"id_token": cookies['id_token']
			}
		};
/*
		if(point!==null)
			packet.data.geometry={type: "Point", coordinates:point}
*/
		window.websocket.send(packet);

	}

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
				<FieldView data={featureData} mode={"write"}/>
				<Button color="success" onClick={saveFeature} variant="contained">Save</Button>
				<Button color="warning" onClick={cancelFeature} variant="contained">Cancel</Button>
				<Button color="error" onClick={deleteFeature} variant="contained">Delete</Button>

			</Box>
		</Box>
	)
}