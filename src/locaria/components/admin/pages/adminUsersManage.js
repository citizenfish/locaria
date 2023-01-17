import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import Button from "@mui/material/Button";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import TokenCheck from "widgets/utils/tokenCheck";
import {useCookies} from "react-cookie";
import {setPage} from "../redux/slices/adminPagesSlice";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid"
import StripedDataGrid from "../../widgets/data/stripedDataGrid";




export default function AdminUsersManage() {

	const history = useHistory();
	const page = useSelector((state) => state.adminPages.page);
	const [cookies, setCookies] = useCookies(['id_token']);
	const dispatch = useDispatch();
	const [users,setUsers]= useState(undefined);

	useEffect(() => {
		window.websocket.registerQueue('userList', (json) => {
			setUsers(json.packet);
		});

		if(users===undefined)
			updateUserList();
	},[users]);

	const updateUserList = (values) => {

		window.websocket.send({
			"queue": "userList",
			"api": "sapi",
			"data": {
				"method": "user_list",
				id_token: cookies['id_token']
			}
		});

	}

	const userActions = (params)=> {
		let id = params.row.id
		return (
			<Grid container>
				<Grid item md={4}>
					<Button variant="outlined"
							color="success"
							size="small"
							onClick={() => {
								dispatch(setPage(page))
								history.push(`/Admin/Users/Manage/${id}`)
							}}>
						Edit
					</Button>
				</Grid>
			</Grid>
		)
	}

	const columns = [
		{field: 'email', headerName: 'Email', width: 400},
		{field: 'status',headerName: 'Status', width: 200},
		{field: 'id', headerName: 'ID', width:200},
		{field: 'actions', headerName: 'Actions', width: 250, renderCell: userActions}
	];



	return (
		<Box sx={{display: 'flex'}}>
			<TokenCheck></TokenCheck>
			<AdminAppBar title={`User - Manager`}/>

			<LeftNav isOpenUsers={true}/>
			<Box
				component="main"
				sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '60px'}}
			>

				<Grid container spacing={2}>
					<Grid item md={4}>
						<Button sx={{marginRight:"5px"}} variant="outlined" color="success" onClick={() => {
						}}>Add New User (Code me)</Button>
					</Grid>
					<Grid item md={6}>
						<Typography>The page manager allows you to edit users on your Locaria site.</Typography>
					</Grid>
				</Grid>
				<Box sx={{ height: '800px', width: 1, mt: '40px'}}>
					{users &&
						<StripedDataGrid
							columns={columns}
							rows={users}
						/>
					}
				</Box>
			</Box>
		</Box>
	)
}