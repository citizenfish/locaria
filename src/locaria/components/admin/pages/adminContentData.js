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
import {useDispatch} from "react-redux";

const columns = [
	{field: 'id', headerName: 'FID', width: 75},
	{field: 'title', headerName: 'Title', width: 150},
	{field: 'text', headerName: 'Description', width: 300},
	{field: 'category', headerName: 'Category', width: 150},
/*
	{field: 'geometry', headerName: 'Geometry', renderCell: viewGeometry, width: 200},
*/
	{field: 'tags', headerName: 'Tags', width: 100}
]

export default function AdminContentData() {

	const [offset, setOffset] = useState(0);
	const [limit, setLimit] = useState(1000);
	const [features, setFeatures] = useState(undefined);
	const [searchText, setSearchText] = useState('');
	const [cookies, setCookies] = useCookies(['location']);

	const dispatch = useDispatch()
	const history = useHistory();



	useEffect(() => {
		window.websocket.registerQueue('getFeatures', (json) => {
			setFeatures(json.packet.features);
		});

		refresh();
	}, [searchText, offset, limit])


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
				limit: limit
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
			<AdminAppBar title={`Content - Data`}/>
			<LeftNav isOpenContent={true}/>
			<Box
				component="main"
				sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '40px'}}
			>
				<h1>Data manager</h1>

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