import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import AdminAppBar from './adminAppBar'
import AdminNavigator from './adminNavigator'

import {useCookies} from "react-cookie";
import {configs, resources} from "themeLocaria";
const drawerWidth = 240
import AdminUploadDrawer from './components/drawers/adminUploadDrawer'
import AdminEditDrawer from './components/drawers/adminEditDrawer'
import AdminEditFeatureDrawer from "./components/drawers/adminEditFeatureDrawer";
import {theme} from "../../../theme/default/adminStyle";
import {ThemeProvider} from "@emotion/react";
import {closeEditDrawer, openEditDrawer} from "./redux/slices/editDrawerSlice";
import {closeUploadDrawer, openUploadDrawer} from "./redux/slices/uploadDrawerSlice";
import {setTitle} from "./redux/slices/adminSlice";
import {useLocation, useParams} from "react-router-dom";
import {openEditFeatureDrawer} from "./redux/slices/editFeatureDrawerSlice";
import {useDispatch, useSelector} from "react-redux";

const Admin= () => {

	const [cookies, setCookies] = useCookies(['location'])
	let {feature} = useParams();
	const dispatch = useDispatch()
	const location = useLocation();

	const adminEditDrawer = useSelector((state) => state.adminEditDrawer.open);


	useEffect(() => {
		router();
	}, []);

	if(cookies['id_token'] === undefined ||
	   cookies['id_token'] === "null") {
		window.location = `https://${resources.cognitoURL}/login?response_type=token&client_id=${resources.poolClientId}&redirect_uri=${location.protocol}//${location.host}/`;
	}


	const router = () => {
		if(feature) {
			dispatch(openEditFeatureDrawer(feature));
			return;
		}

		if (location.pathname.match('/Edit/')&&adminEditDrawer===false) {
			dispatch(openEditDrawer());
			return;

		}

		dispatch(openUploadDrawer());

	}

	return (
		<ThemeProvider theme={theme}>
		<Box sx={{ display: 'flex'}}>
			<AdminAppBar dw = {drawerWidth}/>
			<AdminNavigator dw = {drawerWidth}/>
			<Box
				component="main"
				sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '140px'  }}
			>
				<AdminUploadDrawer></AdminUploadDrawer>
				<AdminEditDrawer></AdminEditDrawer>
				<AdminEditFeatureDrawer></AdminEditFeatureDrawer>

			</Box>
		</Box>
		</ThemeProvider>

	);
};


export default Admin;