import {useDispatch, useSelector} from "react-redux"
import {useCookies} from "react-cookie"
import React, {useEffect} from "react"
import {setPage, setPages} from "../../redux/slices/adminPagesSlice"
//import { DataGrid, GridToolbarQuickFilter, gridClasses } from "@mui/x-data-grid"
//import { alpha, styled } from '@mui/material/styles';
import StripedDataGrid from "../../../widgets/data/stripeDataGrid";
import Box from "@mui/material/Box"
import Link from '@mui/material/Link'
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"

import {useHistory} from "react-router-dom"

export default function PageSelector(props) {

	//const page = useSelector((state) => state.adminPages.page);
	const pages = useSelector((state) => state.adminPages.pages);
	const dispatch = useDispatch()
	const [cookies, setCookies] = useCookies(['location']);
	const history = useHistory();

	//Datagrid

	const nameEdit = (params) => {
		let page = params.row.name
		return (
			<Link onClick={() => {
				dispatch(setPage(page))
				history.push(`/Admin/Content/Pages/Edit/${page}`)
			}}>
				{params.row.name === 'Home' ? '** Site Home Page **' : page}
			</Link>
		)
	}

	const pageActions = (params)=> {
		let page = params.row.name
		return (
			<Grid container>
				<Grid item md={4}>
					<Button variant="outlined"
							color="success"
							size="small"
							onClick={() => {
								dispatch(setPage(page))
								history.push(`/Admin/Content/Pages/Edit/${page}`)
							}}>
						Edit
					</Button>
				</Grid>
				<Grid item md={4}>
					<Button variant="outlined"
							color="error"
							size="small"
							onClick={() => {
								dispatch(setPage(page))
								props.setOpenDelete(true)
							}}>
						Delete
					</Button>
				</Grid>
			</Grid>


		)
	}
	const columns = [
		{field: 'name', headerName: 'Page Name', width: 200, renderCell : nameEdit},
		{field: 'title',headerName: 'Page Title', width: 400},
		{field: 'last_updated', headerName: 'Last Updated', width:200},
		{field: 'actions', headerName: 'Actions', width: 250, renderCell: pageActions}
	]

	useEffect(() => {
		window.websocket.registerQueue('getPages', (json) => {
			if (json.packet){
				let rows=[]
				let id = 0
				for(let i in json.packet.parameters){
					rows.push({
						id: id++,
						name: i,
						title: json.packet.parameters[i].title,
						last_updated: json.packet.parameters[i].last_updated
					})
				}

				dispatch(setPages(rows));
			}

			else{
				dispatch(setPages({}));
			}

		});
		if(pages === undefined){
			getPages();
		}

	},[pages]);

	const getPages = () => {
		window.websocket.send({
			"queue": "getPages",
			"api": "sapi",
			"data": {
				"method": "get_parameters",
				"usage": "Page",
				"delete_key":"data",
				id_token: cookies['id_token'],

			}
		});
	}


	return (
		<Box sx={{ height: '800px', width: 1, mt: '40px'}}>
			{pages &&
			<StripedDataGrid
					  columns={columns}
					  rows={pages}
				/>
			}
		</Box>

	)
}
