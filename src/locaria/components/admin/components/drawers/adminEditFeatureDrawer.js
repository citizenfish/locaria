import React, {useEffect, useRef} from "react"

import {useCookies} from "react-cookie";
import Button from "@mui/material/Button";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Drawer} from "@mui/material";
import {useStyles} from "../../../../../theme/default/adminStyle";
import {closeUploadDrawer} from "../../redux/slices/uploadDrawerSlice";
import {closeEditDrawer, openEditDrawer} from "../../redux/slices/editDrawerSlice";
import {setEditFeatureData} from "../../redux/slices/editFeatureDrawerSlice";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import SearchTags from "../../../search/SearchTags";
import LinearProgress from "@mui/material/LinearProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import {channels} from "themeLocaria";
import {FieldEdit} from "../../../widgets/fieldEdit";
import Map from "../../../widgets/map";
import {setTitle, setTotal} from "../../redux/slices/adminSlice";
import Tags from "../../../widgets/tags"
import Container from "@mui/material/Container";


const  AdminEditFeatureDrawer = (props) => {

	const [cookies, setCookies] = useCookies(['location'])
	const history = useHistory();
	const classes = useStyles();
	const open = useSelector((state) => state.adminEditFeatureDrawer.open);
	const feature = useSelector((state) => state.adminEditFeatureDrawer.feature);
	const data = useSelector((state) => state.adminEditFeatureDrawer.data);
	const dispatch = useDispatch()
	const mapRef = useRef();
	const tagRef = useRef();



	useEffect(() => {
		//This hook manages the refresh of the files display every X seconds
		if (open) {
			history.push(`/Admin/Edit/${feature}`);
			dispatch(closeEditDrawer());
			dispatch(closeUploadDrawer());
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

		window.websocket.send({
			"queue": "viewLoader",
			"api": "api",
			"data": {"method": "get_item", "fid": feature, "live": true}
		});



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
		channels.mergeDataWithForm(data.features[0].properties.category,properties);
		properties.tags=tags;
		console.log(properties);
		window.websocket.send({
			"queue": "saveFeature",
			"api": "sapi",
			"data": {
				"method": "update_item", "fid": feature, "attributes": {
					"description": properties.description,
					"tags": properties.tags
				},
				"id_token": cookies['id_token']
			}
		});

	}



	function editFields() {
		let channel = channels.getChannelProperties(data.features[0].properties.category);
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

	function onChangeTags(newTags) {
		//debugger;
		console.log(newTags);
		data.features[0].properties.tags = newTags;
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
							<Map ref={mapRef} id={'EditMap'} className={'editMapView'}/>
							<p>Owner: {data.features[0].properties.acl ? data.features[0].properties.acl.email : 'No acl'}</p>
							{editFields()}
							<Tags ref={tagRef} tags={data.features[0].properties.tags} mode={'edit'} category={data.features[0].properties.category}></Tags>
						</Container>
						<Container>
							<Button size="small" color="success" onClick={saveFeature} variant="contained">
								Save
							</Button>

							<Button size="small" color="error" onClick={deleteFeature} variant="contained">
								Delete
							</Button>
							<Button size="small" color="primary" onClick={() => {
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

		>
			<ControlActual/>
		</Drawer>

	)

}

export default AdminEditFeatureDrawer;