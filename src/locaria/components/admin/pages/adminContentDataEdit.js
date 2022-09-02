import React, {useEffect, useRef, useState} from 'react';
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import {useHistory, useParams} from "react-router-dom";
import TokenCheck from "../components/utils/tokenCheck";
import {useCookies} from "react-cookie";
import {setFeature, setOverview} from "../redux/slices/adminPagesSlice";
import {useDispatch, useSelector} from "react-redux";
import {FieldView} from "../../widgets/data/fieldView";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormFieldsToData from "../../widgets/data/formFieldsToData";
import Map from "../../widgets/maps/map"
import UploadWidget from "../../widgets/data/uploadWidget";
import SimpleUploadWidget from "../../widgets/data/simpleUploadWidget";


export default function AdminContentDataEdit() {


	const [cookies, setCookies] = useCookies(['location']);
	const feature = useSelector((state) => state.adminPages.feature);
	const [featureData, setFeatureData] = useState(undefined);
	const [images, setImages] = useState(undefined);
	const category = useSelector((state) => state.categorySelect.currentSelected);
	const mapRef = useRef();

	const dispatch = useDispatch();

	let {fid} = useParams();

	const history = useHistory();
	const [point, setPoint] = useState(undefined);


	useEffect(() => {

		window.websocket.registerQueue("viewLoader", function (json) {
			if (json.packet.response_code !== 200) {
				setFeatureData({});
			} else {
				if (json.packet.features[0]) {
					setFeatureData(json.packet.features[0].properties);
					setImages(json.packet.features[0].properties.data.images);
				}
				mapRef.current.addGeojson(json.packet)
				mapRef.current.zoomToLayersExtent(["data"], 50000);
			}
		});

		window.websocket.registerQueue("saveFeature", function (json) {
			dispatch(setOverview(undefined));
			history.push(`/Admin/Content/Data/`);
		});

		window.websocket.registerQueue("deleteFeature", function (json) {
			dispatch(setOverview(undefined));

			history.push(`/Admin/Content/Data/`);
		});

		if (feature) {
			if (feature === -1) {
				setFeatureData({category: category})
			} else {
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
			}
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

	const mapClick = (e) => {

		const geojson = {
			"features": [
				{
					type: "Feature",
					geometry: {type: "Point", coordinates: e.coordinate4326},
					properties: featureData
				}
			], type: "FeatureCollection"
		};
		mapRef.current.addGeojson(geojson, "data", true);
		setPoint(e.ewkt);

	}


	function saveFeature() {
		let data = FormFieldsToData(featureData.category);

		let packet = {
			queue: "saveFeature",
			api: "sapi",
			data: {
				attributes: data,
				id_token: cookies['id_token'],
				category: featureData.category,
			}
		};

		packet.data.attributes.data.images=images;

		if (feature === -1) {
			let channel = window.systemCategories.getChannelProperties(featureData.category);

			packet.data.method = "add_item";
			packet.data.table = channel.table;
		} else {
			packet.data.method = "update_item";
			packet.data.fid = feature;
		}
		if (point !== undefined)
			packet.data.geometry = point;
		window.websocket.send(packet);

	}

	function imageSelect(images) {
		setImages(images);
	}

	return (
		<Box sx={{display: 'flex'}}>
			<TokenCheck></TokenCheck>
			<AdminAppBar title={`Content - Data`}/>
			<LeftNav isOpenContent={true}/>
			<Box
				component="main"
				sx={{flexGrow: 1, marginTop: '60px',width:"calc(100vw - 250px)"}}
			>
				<Grid container spacing={2} sx={{mt: 1, p: 3}}>
					<Grid item md={1}>
						<Button color="warning" onClick={cancelFeature} variant="outlined">Cancel</Button>
					</Grid>
					{featureData&&
						<>
							<Grid item md={1}>
								<Button color="success" onClick={saveFeature} variant="outlined"
										disabled={feature === -1 && point === undefined ? true : false}>Save</Button>
							</Grid>
							<Grid item md={1}>
								<Button color="error" onClick={deleteFeature} variant="outlined"
										disabled={feature === -1 ? true : false}>Delete</Button>
							</Grid>
						</>
					}
					<Grid item md={9}>
						<Typography>The data editor allows you to edit data.</Typography>
					</Grid>
				</Grid>
				{featureData &&
					<Grid container spacing={2}>
						<Grid item md={6}>
							<Map id={"dropMap"} speedDial={false} height={"500px"} ref={mapRef}
								 handleMapClick={mapClick}/>
						</Grid>
						<Grid item md={6}>
							<SimpleUploadWidget images={featureData.data.images} setFunction={imageSelect} feature={feature}/>
						</Grid>
					</Grid>
				}
				{featureData !== undefined ? <><FieldView data={featureData} mode={"write"}/></> : <h1>Feature has been deleted, refresh the view to remove it from live</h1>}

			</Box>
		</Box>
	)
}


/*
<Button color="success" onClick={saveFeature} variant="contained">Save</Button>
				<Button color="warning" onClick={cancelFeature} variant="contained">Cancel</Button>
				<Button color="error" onClick={deleteFeature} variant="contained">Delete</Button>
 */