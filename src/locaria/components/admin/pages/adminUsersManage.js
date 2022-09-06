import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import Button from "@mui/material/Button";
import PageSelector from "../components/selectors/pageSelector";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import TokenCheck from "../components/utils/tokenCheck";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import DialogContentText from "@mui/material/DialogContentText";
import {useFormik} from "formik";
import * as yup from 'yup';
import {useCookies} from "react-cookie";
import {setPage, setPages} from "../redux/slices/adminPagesSlice";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid"




export default function AdminUsersManage() {

	const history = useHistory();
	const page = useSelector((state) => state.adminPages.page);
	const [cookies, setCookies] = useCookies(['id_token']);
	const dispatch = useDispatch()

	useEffect(() => {
		updateUserList();
	});

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
			</Box>
		</Box>
	)
}