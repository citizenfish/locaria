import {useDispatch, useSelector} from "react-redux"
import {useCookies} from "react-cookie"
import React, {useEffect} from "react"
import {setConfig, setConfigs, setPages} from "../../redux/slices/adminPagesSlice"
import StripedDataGrid from "../../../widgets/data/stripedDataGrid";
import Box from "@mui/material/Box"
import Link from '@mui/material/Link'
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"

import {useHistory} from "react-router-dom"

export default function ConfigSelector(props) {

	//const page = useSelector((state) => state.adminPages.page);
	const configs = useSelector((state) => state.adminPages.configs);
	const dispatch = useDispatch()
	const [cookies, setCookies] = useCookies(['location']);
	const history = useHistory();

	//Datagrid

	const configActions = (params)=> {
		let config = params.row.name
		return (
			<Grid container>
				<Grid item md={4}>
					<Button variant="outlined"
							color="success"
							size="small"
							onClick={() => {
								dispatch(setConfig(config))
								history.push(`/Admin/Config/Parameters/${config}`)
							}}>
						Edit
					</Button>
				</Grid>
			</Grid>
		)
	}
	const columns = [
		{field: 'name', headerName: 'Config Name', width: 200},
		{field: 'title',headerName: 'Config title', width: 400},
		{field: 'last_updated', headerName: 'Last Updated', width:200},
		{field: 'actions', headerName: 'Actions', width: 250, renderCell: configActions}
	]

	useEffect(() => {
		window.websocket.registerQueue('getConfigs', (json) => {
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

				dispatch(setConfigs(rows));
			}

			else{
				dispatch(setConfigs({}));
			}

		});
		if(configs === undefined){
			getConfigs();
		}

	},[configs]);

	const getConfigs = () => {
		window.websocket.send({
			"queue": "getConfigs",
			"api": "sapi",
			"data": {
				"method": "get_parameters",
				"usage": "Config",
				"delete_key":"data",
				id_token: cookies['id_token'],

			}
		});
	}


	return (
		<Box sx={{ height: '800px', width: 1, mt: '40px'}}>
			{configs &&
			<StripedDataGrid
					  columns={columns}
					  rows={configs}
				/>
			}
		</Box>

	)
}
