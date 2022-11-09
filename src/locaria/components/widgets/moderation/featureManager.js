import React, {useEffect, useState} from "react";
import StripedDataGrid from "../data/stripedDataGrid";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {useCookies} from "react-cookie";
import {useSelector} from "react-redux";


const FeatureManager = function ({category}) {
	const [features, setFeatures] = useState([])
	const [cookies, setCookies] = useCookies();
	const id = useSelector((state) => state.userSlice.id);

	useEffect(() =>{
		window.websocket.registerQueue('getMyFeatures', (json) => {
			setFeatures(json.packet.features);
		});
		refresh();
	},[])

	const selectRow = (row) => {
		//dispatch(setFeature(row.id));
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


	const columns = [
		{field: 'id', headerName: 'FID', width: 75},
		{field: 'title', headerName: 'Title', width: 300},
		{field: 'text', headerName: 'Description', width: 300},
		{field: 'category', headerName: 'Category', width: 150},
		{field: 'actions', headerName: 'Actions', width: 250, renderCell: dataActions}
	]

	const refresh = () => {
		window.websocket.send({
			queue: "getMyFeatures",
			api: "api",
			data: {
				method: "search",
				id_token: cookies['id_token'],
				format: "datagrid",
				category: category,
				owned: true
			}
		})
	}

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

export default FeatureManager;