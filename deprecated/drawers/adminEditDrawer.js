import React, {useState, useEffect, useRef} from "react"
import {DataGrid} from '@mui/x-data-grid'
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from "@mui/icons-material/Search";
import TextField from '@mui/material/TextField';
import {useCookies} from "react-cookie";
import Button from "@mui/material/Button";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Drawer} from "@mui/material";
import {useStyles} from "../../theme/default/adminStyle";
import {closeUploadDrawer} from "../uploadDrawerSlice";
import {closeEditFeatureDrawer} from "../editFeatureDrawerSlice";
import {openEditFeatureDrawer} from "../editFeatureDrawerSlice";
import {setEditData} from "../editDrawerSlice";
import {setTitle} from "../adminSlice";
import {closeSystemConfigDrawer} from "../systemConfigDrawerSlice";
import {closeAdminPageDrawer} from "../../locaria/components/admin/redux/slices/adminPagesSlice";
import {closeDashboardDrawer} from "../adminDashboardDrawerSlice";
import {closeAdminCategoryDrawer} from "../adminCategoryDrawerSlice";
import {closeLanguageDrawer} from "../adminLanguageDrawerSlice";


export default function AdminEditDrawer(props) {

	const [cookies, setCookies] = useCookies(['location'])

	const [searchText, setSearchText] = useState(null)
	const [searchInput, setSearchInput] = useState('')
	const [offset, setOffset] = useState(0)
	const [limit, setLimit] = useState(20)
	const history = useHistory();
	const classes = useStyles();
	const open = useSelector((state) => state.adminEditDrawer.open);
	const data = useSelector((state) => state.adminEditDrawer.data);
	const dispatch = useDispatch()

	const isInitialMount = useRef(true);

	const viewGeometry = (params) => {

		return (
			<Button
				variant="contained"
				color={params.value === null ? 'error' : 'success'}
				size="small"
				onClick={() => {
					if (params.value !== null) {

						let geoJSON = {
							"type": "FeatureCollection",
							"features": [
								{
									"type": "Feature",
									"properties": {},
									"geometry": params.value
								}
							]
						}
						console.log(geoJSON)
						//setMapData({display: true, geojson: geoJSON})
					}
				}}
			>
				{params.value === null ? 'No Geometry' : params.value.type}
			</Button>
		)
	}

	const selectRow = (row) => {
		console.log(row);
		dispatch(openEditFeatureDrawer(row.id))

	}

	const columns = [
		{field: 'id', headerName: 'FID', width: 75},
		{field: 'title', headerName: 'Title', width: 150},
		{field: 'text', headerName: 'Description', width: 300},
		{field: 'category', headerName: 'Category', width: 150},
		{field: 'geometry', headerName: 'Geometry', renderCell: viewGeometry, width: 200},
		{field: 'tags', headerName: 'Tags', width: 100}
	]

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			setSearchText('')
		}

		if(open) {
			history.push(`/Admin/Edit/`);
			dispatch(closeUploadDrawer());
			dispatch(closeEditFeatureDrawer());
			dispatch(closeSystemConfigDrawer());
			dispatch(closeAdminPageDrawer());
			dispatch(closeDashboardDrawer());
			dispatch(closeAdminCategoryDrawer());
			dispatch(closeLanguageDrawer());

			dispatch(setTitle('Edit'));
			refresh();
		}
		window.websocket.registerQueue('getFeatures', (json) => {
			dispatch(setEditData(json.packet.features));
		})
	}, [open])

	useEffect(() => {
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

	const searchFieldChange = (e) => {
		setSearchInput(e.target.value)
	}

	const  handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			search();
			e.preventDefault();
		}
	}

	const search = () => {
		setSearchText(searchInput)
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
			<Box
				component="form"
				sx={{
					'& .MuiTextField-root': {m: 1, width: '25ch'},
				}}
				noValidate
				autoComplete="off"
			>
				<TextField
					id="filled-search"
					label="Search field"
					type="search"
					variant="filled"
					onChange={searchFieldChange}
					onKeyDown={handleKeyDown}
					autoComplete={'off'}
					autoFocus={true}
					InputProps={{
						endAdornment: (
							<InputAdornment position="start"
							                onClick={search}

							>
								<SearchIcon/>
							</InputAdornment>
						)
					}}
				/>

			</Box>
			<Button disabled={true}>Edit</Button>
			{
				open===true && data.length > 0 &&
				<DataGrid columns={columns}
				          rows={data}
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
			}
		</Drawer>

	)

}