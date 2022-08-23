import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import {useHistory, useParams} from "react-router-dom";
import TokenCheck from "../components/utils/tokenCheck";
import {useCookies} from "react-cookie";
import {setFeature} from "../redux/slices/adminPagesSlice";
import {useDispatch, useSelector} from "react-redux";
import Typography from "@mui/material/Typography";
import CategorySelector from "../components/selectors/categorySelector";
import StripedDataGrid from "../../widgets/data/stripedDataGrid";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";



export default function AdminContentData() {

	const [offset, setOffset] = useState(0)
	const [limit, setLimit] = useState(1000)
	const [features, setFeatures] = useState([])
	const [searchText, setSearchText] = useState('')
	const category = useSelector((state) => state.categorySelect.currentSelected);

	const [cookies, setCookies] = useCookies(['location'])


	const dispatch = useDispatch()
	const history = useHistory();

	const selectRow = (row) => {
		dispatch(setFeature(row.id));
		history.push(`/Admin/Content/Data/Edit`);
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
				<Grid item md={4}>
					<Button variant="outlined"
							color="error"
							size="small"
							onClick={() => {

							}}>
						Delete
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

	useEffect(() => {
		window.websocket.registerQueue('getFeatures', (json) => {
			setFeatures(json.packet.features);
		});

		refresh();
	}, [searchText, offset, limit])

	useEffect(() =>{
		refresh()
	},[category])

	const refresh = () => {
		window.websocket.send({
			queue: "getFeatures",
			api: "api",
			data: {
				method: "search",
				search_text: searchText,
				id_token: cookies['id_token'],
				format: "datagrid",
				offset: offset,
				limit: limit,
				category: category
			}
		})
	}



	return (

		<Box sx={{display: 'flex'}}>
			<TokenCheck></TokenCheck>
			<AdminAppBar title={`Data Manager`}/>
			<LeftNav isOpenContent={true}/>

			<Box
				component="main"
				sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '60px'}}
			>

				<Grid container spacing={2}>
					<Grid item md={6}>
						<CategorySelector/>
					</Grid>
					<Grid item md={4}>
						<Typography>The data manager allows you to edit data and articles in the system.</Typography>
					</Grid>
				</Grid>

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
		</Box>
	)
}