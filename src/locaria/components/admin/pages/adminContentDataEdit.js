import React, {useEffect, useRef, useState} from 'react';
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import {useHistory, useParams} from "react-router-dom";
import TokenCheck from "widgets/utils/tokenCheck";
import {useCookies} from "react-cookie";
import {setFeature, setOverview} from "../redux/slices/adminPagesSlice";
import {useDispatch, useSelector} from "react-redux";
import {FieldView} from "widgets/data/fieldView";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {FormFieldsToData} from "widgets/data/formFieldsToData";
import {submitForm} from "components/redux/slices/formSlice";


export default function AdminContentDataEdit() {


	const [cookies, setCookies] = useCookies(['location']);
	//TODO feature does not really belong in pages state? move into own state
	const feature = useSelector((state) => state.adminPages.feature);
	//const formData = useSelector((state) => state.formSlice.formData);
	const formSubmitted = useSelector((state) => state.formSlice.formSubmitted);

	const [featureData, setFeatureData] = useState(undefined);
	const [queueName, setQueueName] = useState(undefined);
	const category = useSelector((state) => state.categorySelect.currentSelected);

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
					setFeatureData(json.packet.features[0]);

				}
			}
		});



		window.websocket.registerQueue("saveFeature", function (json) {
			dispatch(setOverview(undefined));
			history.push(`/Admin/Content/Data/`);
		});

		window.websocket.registerQueue("saveFeaturePublish", function (json) {
			window.websocket.send({
				"queue": "refreshView",
				"api": "sapi",
				"data": {
					"method": "refresh_search_view",
					"id_token": cookies['id_token']
				}
			});
			dispatch(setOverview(undefined));
			history.push(`/Admin/Content/Data/`);
		});

		window.websocket.registerQueue("deleteFeature", function (json) {
			dispatch(setOverview(undefined));

			history.push(`/Admin/Content/Data/`);
		});

		if (feature) {
			if (feature === -1) {
				setFeatureData({properties:{category: category}})
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


	function saveFeature(queueName="saveFeature") {
		setQueueName(queueName);
		dispatch(submitForm());
	};

	useEffect(() => {
		if(formSubmitted!==undefined) {
			//let data = FormFieldsToData(featureData.properties.category,formData);
			let channel = window.systemCategories.getChannelProperties(featureData.properties.category);

			let fieldsData = channel.fields["main"];
			let data = FormFieldsToData(featureData.properties.category, formSubmitted, fieldsData);
			if (!data.data)
				data.data = {};
			let packet = {
				queue: queueName,
				api: "sapi",
				data: {
					attributes: data.properties,
					id_token: cookies['id_token'],
					category: featureData.properties.category,
				}
			};

			if (feature === -1) {
				packet.data.method = "add_item";
				packet.data.table = channel.table;
			} else {
				packet.data.method = "update_item";
				packet.data.fid = feature;
			}
			if (data.geometry)
				packet.data.geometry = data.geometry;
			window.websocket.send(packet);
		}

	},[formSubmitted]);

	if(formSubmitted===undefined) {

		return (
			<Box sx={{display: 'flex'}}>
				<TokenCheck></TokenCheck>
				<AdminAppBar title={`Content - Data`}/>
				<LeftNav isOpenContent={true}/>
				<Box
					component="main"
					sx={{marginTop: '60px', padding: "50px"}}
				>
					<Grid container spacing={2} sx={{mt: 1, p: 3}}>
						<Grid item md={8}>
							<Button color="warning"
									onClick={cancelFeature}
									variant="outlined" sx={{margin: "5px"}}>Cancel</Button>
								<>
									<Button color="success"
											onClick={(e) => saveFeature()}
											variant="outlined"
											sx={{margin: "5px"}}
											disabled={feature === -1 && point === undefined ? true : false}>Save</Button>

									<Button color="success"
											onClick={(e) => saveFeature("saveFeaturePublish")}
											variant="outlined"
											sx={{margin: "5px"}}
											disabled={feature === -1 && point === undefined ? true : false}>Save &
										Publish</Button>
									<Button color="error"
											onClick={deleteFeature}
											variant="outlined"
											sx={{margin: "5px"}}
											disabled={feature === -1 ? true : false}>Delete</Button>
								</>
						</Grid>

						<Grid item md={4}>
							<Typography>The data editor allows you to edit data.</Typography>
						</Grid>
					</Grid>
					<FieldView data={featureData} mode={"write"} fields={"main"}/>
				</Box>
			</Box>
		)
	}else {
		return (<></>)
	}
}

