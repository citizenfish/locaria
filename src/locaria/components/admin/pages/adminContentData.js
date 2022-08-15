import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import {useHistory, useParams} from "react-router-dom";
import TokenCheck from "../components/utils/tokenCheck";
import {useCookies} from "react-cookie";
import {setEditData} from "../../../../deprecated/editDrawerSlice";
import {DataGrid} from "@mui/x-data-grid";
import {openEditFeatureDrawer} from "../../../../deprecated/editFeatureDrawerSlice";
import {setFeature} from "../redux/slices/adminPagesSlice";
import {useDispatch, useSelector} from "react-redux";
import Typography from "@mui/material/Typography";
import CategorySelector from "../components/selectors/categorySelector";

const columns = [
	{field: 'id', headerName: 'FID', width: 75},
	{field: 'title', headerName: 'Title', width: 300},
	{field: 'text', headerName: 'Description', width: 300},
	{field: 'category', headerName: 'Category', width: 150},
/*
	{field: 'geometry', headerName: 'Geometry', renderCell: viewGeometry, width: 200},
*/
	{field: 'tags', headerName: 'Tags', width: 100}
]

export default function AdminContentData() {

	const [offset, setOffset] = useState(0)
	const [limit, setLimit] = useState(1000)
	const [features, setFeatures] = useState(undefined)
	const [searchText, setSearchText] = useState('')
	const category = useSelector((state) => state.categorySelect.currentSelected);

	const [cookies, setCookies] = useCookies(['location'])


	const dispatch = useDispatch()
	const history = useHistory();



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

	const selectRow = (row) => {
		console.log(row);
		dispatch(setFeature(row.id));
		history.push(`/Admin/Content/Data/Edit`);
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
				<Typography variant = "h4" mb={1}>Data Manager</Typography>
				<Typography mb={1}>Select an article or data item to edit or delete</Typography>
				<CategorySelector/>
				<DataGrid columns={columns}
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