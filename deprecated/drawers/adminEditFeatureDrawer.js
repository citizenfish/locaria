import React, {useEffect, useRef, useState} from "react"

import {useCookies} from "react-cookie";
import Button from "@mui/material/Button";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Drawer} from "@mui/material";
import {useStyles} from "../../theme/default/adminStyle";
import {closeUploadDrawer} from "../uploadDrawerSlice";
import {closeEditDrawer, openEditDrawer} from "../editDrawerSlice";
import {setEditFeatureData} from "../editFeatureDrawerSlice";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import SearchTags from "../../locaria/components/search/SearchTags";
import LinearProgress from "@mui/material/LinearProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import {FieldEdit} from "../../locaria/components/widgets/fieldEdit";
import Map from "../../locaria/components/widgets/map";
import {setTitle, setTotal} from "../adminSlice";
import Tags from "../../locaria/components/widgets/tags"
import Container from "@mui/material/Container";
import {closeSystemConfigDrawer} from "../systemConfigDrawerSlice";
import {closeAdminPageDrawer} from "../../locaria/components/admin/redux/slices/adminPagesSlice";
import {closeDashboardDrawer} from "../adminDashboardDrawerSlice";
import {closeAdminCategoryDrawer} from "../adminCategoryDrawerSlice";
import {closeLanguageDrawer} from "../adminLanguageDrawerSlice";


const  AdminEditFeatureDrawer = (props) => {

	const [cookies, setCookies] = useCookies(['location'])
	const history = useHistory();
	const classes = useStyles();
	const open = useSelector((state) => state.adminEditFeatureDrawer.open);
	const feature = useSelector((state) => state.adminEditFeatureDrawer.feature);
	const data = useSelector((state) => state.adminEditFeatureDrawer.data);
	const dispatch = useDispatch();
	const mapRef = useRef();
	const tagRef = useRef();

	let point=null;


	useEffect(() => {
		//This hook manages the refresh of the files display every X seconds
		if (open) {
			history.push(`/Admin/Edit/${feature}`);
			dispatch(closeEditDrawer());
			dispatch(closeUploadDrawer());
			dispatch(closeSystemConfigDrawer());
			dispatch(closeAdminPageDrawer());
			dispatch(closeDashboardDrawer());
			dispatch(closeAdminCategoryDrawer());
			dispatch(closeLanguageDrawer());
			dispatch(setTitle('Feature Edit'));

		}

	}, [open]);


	useEffect(() => {
		window.websocket.registerQueue("viewLoader", function (json) {
			if (json.packet.response_code !== 200) {
				dispatch(setEditFeatureData({}));
			} else {
				dispatch(setEditFeatureData(json.packet));
				mapRef.current.addGeojson(json.packet)
				mapRef.current.zoomToLayersExtent(["data"], 50000)
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
			/// dispatch a view needs updating
			dispatch(setTotal(-1));
			dispatch(openEditDrawer());
		});

		window.websocket.registerQueue("deleteFeature", function (json) {
			dispatch(setTotal(-1));
			dispatch(openEditDrawer());
		});

	}, [feature])

	function saveFeature() {
		let tags=tagRef.current.getTags();
		let properties=JSON.parse(JSON.stringify(data.features[0].properties));
		window.systemCategories.mergeDataWithForm(data.features[0].properties.category,properties);
		properties.tags=tags;

		let packet={
			"queue": "saveFeature",
			"api": "sapi",
			"data": {
				"method": "update_item", "fid": feature, "attributes": {
					"description": properties.description,
					"tags": properties.tags
				},
				"id_token": cookies['id_token']
			}
		};
		if(point!==null)
			packet.data.geometry={type: "Point", coordinates:point}
		window.websocket.send(packet);

	}



	function editFields() {
		let channel = window.systemCategories.getChannelProperties(data.features[0].properties.category);
		if (channel.fields) {
			return (
				<FieldEdit data={data.features[0].properties}></FieldEdit>
			)
		} else {
			// No channel config so we just display what we got
			return (
				<h1>No field setup</h1>
			)
		}

	}

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


	const mapClick = (e) => {

		const geojson={"features": [
				{
					type: "Feature",
					geometry: {type: "Point", coordinates:e.coordinate4326},
					properties: data.features[0].properties
				}
			], type: "FeatureCollection"};
		mapRef.current.addGeojson(geojson,"data",true);
		point=e.coordinate4326;

	}

	const ControlActual = () => {
		if (data !== null) {
			if (data.features === undefined) {
				return (

					<Paper elevation={3} className={classes.paperMargin}>
						<Card className={classes.root}>
							<CardContent>
								<Typography variant="h5" component="h2" className={classes.viewTitle}>
									Feature not found
								</Typography>
								<Typography variant="body2" color="textSecondary" component="p">
									It may have been deleted but the view has not been
									refreshed
								</Typography>
							</CardContent>
							<CardActions>
								<Button size="small" color="secondary" onClick={() => {
									dispatch(openEditDrawer());
								}} variant="outlined">
									Back
								</Button>
							</CardActions>
						</Card>

					</Paper>

				)
			} else {
				return (
					<>
						<Container>
							<Map ref={mapRef} id={'EditMap'} className={'editMapView'} handleMapClick={mapClick}/>
							<p>Owner: {data.features[0].properties.acl ? data.features[0].properties.acl.email : 'No acl'}</p>
							{editFields()}
							<Tags ref={tagRef} tags={data.features[0].properties.tags} mode={'edit'} category={data.features[0].properties.category}></Tags>
						</Container>
						<Container>
							<Button size="small" color="success" onClick={saveFeature} variant="contained" className={classes.editButtons}>
								Save
							</Button>

							<Button size="small" color="error" onClick={deleteFeature} variant="contained" className={classes.editButtons}>
								Delete
							</Button>
							<Button  className={classes.editButtons} size="small" color="primary" onClick={() => {
								dispatch(openEditDrawer());
							}} variant="contained">
								Back
							</Button>
						</Container>
					</>

				);
			}
		} else {
			return (
				<LinearProgress/>
			)
		}
	}

	return (
		<Drawer
			anchor="right"
			open={open}
			variant="persistent"
			className={classes.adminDrawers}
			sx={{
				'.MuiDrawer-paper': {
					borderLeft: 'none',
					zIndex: 2,
				},
			}}
		>
			<ControlActual/>
		</Drawer>

	)

}

export default AdminEditFeatureDrawer;