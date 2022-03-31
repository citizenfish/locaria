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
import {useStyles} from 'stylesLocaria';
import {closeUploadDrawer} from "../../redux/slices/uploadDrawerSlice";



export default function AdminEditDrawer(props) {

	const [cookies, setCookies] = useCookies(['location'])
	const [featureData, setFeatureData] = useState([])
	const [searchText, setSearchText] = useState(null)
	const [searchInput, setSearchInput] = useState('')
	const [offset, setOffset] = useState(0)
	const [limit, setLimit] = useState(20)
	const history = useHistory();
	const classes = useStyles();
	const open = useSelector((state) => state.adminEditDrawer.open);
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
		debugger;

		if (isInitialMount.current) {
			isInitialMount.current = false;
			setSearchText('')
		}

		if(open) {
			history.push(`/Admin/Edit/`);
			dispatch(closeUploadDrawer)
		}
		window.websocket.registerQueue('getFeatures', (json) => {
			// if(json.packet.features.length > 0){
			setFeatureData(json.packet.features)
			//}
		})
	}, [open])

	useEffect(() => {
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
	}, [searchText, offset, limit])


	const searchFieldChange = (e) => {
		setSearchInput(e.target.value)
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
				featureData.length > 0 &&
				<DataGrid columns={columns}
				          rows={featureData}
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