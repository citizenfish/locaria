import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import {useHistory, useParams} from "react-router-dom";
import TokenCheck from "../components/utils/tokenCheck";
import {useCookies} from "react-cookie";
import {setFeature} from "../redux/slices/adminPagesSlice";
import {useDispatch, useSelector} from "react-redux";
import {FieldView} from "../../widgets/data/fieldView";
import Button from "@mui/material/Button";
import MdSerialize from "../../../libs/mdSerialize";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";



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
				queue: "viewLoader",
				api: "api",
				data: {
					method: "get_item",
					fid: feature,
					live: true,
					id_token: cookies['id_token']
				}
			});
		} else {
			dispatch(setFeature(fid));
		}

	}, [feature])

	function deleteFeature() {
		window.websocket.send({
			queue: "deleteFeature",
			api: "sapi",
			data: {
				method: "delete_item",
				fid: feature,
				id_token: cookies['id_token']
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
			queue: "saveFeature",
			api: "sapi",
			data: {
				method: "update_item",
				fid: feature,
				attributes: {
					description:{
						text:obj
					},
				},
				id_token: cookies['id_token']
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
				sx={{flexGrow: 1, marginTop: '60px'}}
			>
				<Grid container spacing={2} sx={{mt:1, p:3}}>
					<Grid item md={1}>
						<Button color="warning" onClick={cancelFeature} variant="outlined">Cancel</Button>
					</Grid>
					<Grid item md={1}>
						<Button color="success" onClick={saveFeature} variant="outlined">Save</Button>
					</Grid>
					<Grid item md={1}>
						<Button color="error" onClick={deleteFeature} variant="outlined">Delete</Button>
					</Grid>
					<Grid item md={9}>
						<Typography>The data editor allows you to edit data.</Typography>
					</Grid>
				</Grid>
				<Box sx={{p:3, maxWidth: 'calc(100vw - 240px)'}}>
					<FieldView data={featureData}
							   mode={"write"}/>
				</Box>
			</Box>
		</Box>
	)
}

/*
<Button color="success" onClick={saveFeature} variant="contained">Save</Button>
				<Button color="warning" onClick={cancelFeature} variant="contained">Cancel</Button>
				<Button color="error" onClick={deleteFeature} variant="contained">Delete</Button>
 */