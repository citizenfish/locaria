import React, {useEffect, useState} from "react";
import StripedDataGrid from "../data/stripedDataGrid";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {useCookies} from "react-cookie";
import {useDispatch, useSelector} from "react-redux";
import {FieldView} from "../data/fieldView";
import {FormFieldsToData} from "../data/formFieldsToData";
import Typography from "@mui/material/Typography";
import {submitForm} from "components/redux/slices/formSlice";


const FeatureManager = function ({category}) {
	const [features, setFeatures] = useState([]);
	const [feature, setFeature] = useState(undefined);
	const [featureData, setFeatureData] = useState(undefined);
	const [cookies, setCookies] = useCookies();
	//const formData = useSelector((state) => state.formSlice.formData);
	const formSubmitted = useSelector((state) => state.formSlice.formSubmitted);
	const dispatch = useDispatch();



	const id = useSelector((state) => state.userSlice.id);

	useEffect(() =>{
		window.websocket.registerQueue('saveMyFeature', (json) => {
			refresh();
		});
		window.websocket.registerQueue('getMyFeatures', (json) => {
			setFeatures(json.packet.features);
		});
		window.websocket.registerQueue("myViewLoader", function (json) {
			setFeatureData(json.packet.features[0]);
		});
		refresh();
	},[]);

	useEffect(() => {
		if(feature!==undefined) {
			window.websocket.send({
				queue: "myViewLoader",
				api: "api",
				data: {
					method: "get_item",
					fid: feature,
					live: true,
					id_token: cookies['id_token']
				}
			});
		}
	},[feature]);

	const selectRow = (row) => {
		setFeature(row.id);
		//history.push(`/Admin/Content/Data/Edit/${row.id}`);
	}

	const dataActions = (params) => {
		let id = params.row.id

		return (
			<Grid container>
				<Grid item md={4}>
					<Button variant="outlined"
							color="success"
							size="small"
							onClick={() => {
								selectRow(id)
							}}>
						Edit
					</Button>
				</Grid>
			</Grid>
		)
	}

	function dataModeration(params) {
		let count = parseInt(params.row.moderation_status);
		if(count>0) {
			return (<p>{count} Moderations pending</p>)
		}
		return (<p>Live on site</p>);
	}

	function cancelFeature() {
		refresh();
	}

	useEffect(() => {
			if(formSubmitted!==undefined) {
				let channel = window.systemCategories.getChannelProperties(featureData.properties.category);

				let fieldsData = channel.fields["main"];
				let data = FormFieldsToData(featureData.properties.category, formSubmitted, fieldsData);

				//let data = FormFieldsToData(featureData.properties.category,formData);

				let packet = {
					queue: "saveMyFeature",
					api: "api",
					data: {
						attributes: data.properties,
						id_token: cookies['id_token'],
						category: featureData.properties.category,
					}
				};


				packet.data.method = "update_item";
				packet.data.fid = feature;
				if (data.geometry)
					packet.data.geometry = data.geometry;
				window.websocket.send(packet);
			}
	},[formSubmitted]);


	const columns = [
		{field: 'id', headerName: 'FID', width: 75},
		{field: 'title', headerName: 'Title', width: 300},
		{field: 'moderation_status', headerName: 'Status', width: 300,renderCell: dataModeration},
		{field: 'category', headerName: 'Category', width: 150},
		{field: 'actions', headerName: 'Actions', width: 250, renderCell: dataActions}
	]

	const refresh = () => {
		setFeatureData(undefined);
		setFeature(undefined);

		window.websocket.send({
			queue: "getMyFeatures",
			api: "api",
			data: {
				method: "get_my_items",
				id_token: cookies['id_token'],
				category: category,
			}
		})
	}

	if(featureData) {
		return (
			<Box
				component="main"
				sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '60px'}}
			>
				<Grid container spacing={2} sx={{mt: 1, p: 3}}>
					<Grid item md={8}>
						<Button color="warning"
								onClick={cancelFeature}
								variant="outlined" sx={{margin:"5px"}}>Cancel</Button>
								<Button color="success"
										onClick={(e)=>{dispatch(submitForm())}}
										variant="outlined"
										sx={{margin:"5px"}}
										>Save</Button>

					</Grid>

					<Grid item md={4}>
						<Typography>The data editor allows you to edit data.</Typography>
					</Grid>
				</Grid>
				<FieldView data={featureData} mode={"write"} fields={"main"}/>
			</Box>
		)
	} else {
		return (
			<Box
				component="main"
				sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '60px'}}
			>
				<StripedDataGrid columns={columns}
								 rows={features}
								 autoHeight
								 onRowClick={selectRow}
								 initialState={{
									 columns: {
										 columnVisibilityModel: {
											 id: false
										 }
									 },
									 sorting: {
										 sortModel: [{field: 'id', sort: 'desc'}],
									 },
								 }}
				/>
			</Box>
		)
	}
}

export default FeatureManager;