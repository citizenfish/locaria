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
import ConfigSelector from "../components/selectors/configSelector";


const validationSchemaAdd = yup.object({
	url: yup
		.string('Enter page url')
		.min(3, 'Url should 3 of more characters')
		.required('Url is required'),
	title: yup
		.string('Enter page title')
		.min(3, 'Title should 3 of more characters')
		.required('Title is required'),
});

export default function AdminConfig() {

	const history = useHistory();
	const page = useSelector((state) => state.adminPages.page);
	const [cookies, setCookies] = useCookies(['id_token']);
	const dispatch = useDispatch()


	return (
		<Box sx={{display: 'flex'}}>
			<TokenCheck></TokenCheck>
			<AdminAppBar title={`Config - Parameters`}/>

			<LeftNav isOpenConfig={true}/>
			<Box
				component="main"
				sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '60px'}}
			>

				<Grid container spacing={2}>

					<Grid item md={6}>
						<Typography>The page manager allows you to edit the config parameters of your Locaria site. </Typography>
					</Grid>
				</Grid>

				<ConfigSelector/>

			</Box>
		</Box>
	)
}