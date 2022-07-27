import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import AdminAppBar from '../locaria/components/admin/adminAppBar'
import AdminNavigator from '../locaria/components/admin/adminNavigator'

import {useCookies} from "react-cookie";
import {configs, resources} from "themeLocaria";
const drawerWidth = 240
import AdminUploadDrawer from '../locaria/components/admin/components/drawers/adminUploadDrawer'
import AdminEditDrawer from '../locaria/components/admin/components/drawers/adminEditDrawer'
import AdminEditFeatureDrawer from "../locaria/components/admin/components/drawers/adminEditFeatureDrawer";
import {theme} from "../theme/default/adminStyle";
import {ThemeProvider} from "@emotion/react";
import {openEditDrawer} from "../locaria/components/admin/redux/slices/editDrawerSlice";
import {openUploadDrawer} from "../locaria/components/admin/redux/slices/uploadDrawerSlice";
import {useLocation, useParams} from "react-router-dom";
import {openEditFeatureDrawer} from "../locaria/components/admin/redux/slices/editFeatureDrawerSlice";
import {useDispatch, useSelector} from "react-redux";
import AdminSystemConfigDrawer from "../locaria/components/admin/components/drawers/adminSystemConfigDrawer";
import {openSystemConfigDrawer} from "../locaria/components/admin/redux/slices/systemConfigDrawerSlice";
import AdminPageDrawer from "../locaria/components/admin/components/drawers/adminPageDrawer";
import {openAdminPageDrawer} from "../locaria/components/admin/redux/slices/adminPageDrawerSlice";
import AdminDashboardDrawer from "../locaria/components/admin/components/drawers/adminDashboardDrawer";
import AdminCategoryConfigDrawer from "../locaria/components/admin/components/drawers/adminCategoryConfigDrawer";
import {openAdminCategoryDrawer} from "../locaria/components/admin/redux/slices/adminCategoryDrawerSlice";
import AdminLanguageDrawer from "../locaria/components/admin/components/drawers/adminLanguageDrawer";
import {openLanguageDrawer} from "../locaria/components/admin/redux/slices/adminLanguageDrawerSlice";

const Admin= () => {

	const [cookies, setCookies] = useCookies(['location'])
	let {feature} = useParams();
	const dispatch = useDispatch()
	const location = useLocation();

	const adminEditDrawer = useSelector((state) => state.adminEditDrawer.open);
	const systemConfigDrawer = useSelector((state) => state.systemConfigDrawer.open);
	const adminPageDrawer = useSelector((state) => state.adminPageDrawer.open);
	const adminUploadDrawer = useSelector((state) => state.adminUploadDrawer.open);
	const adminCategoryDrawer = useSelector((state) => state.adminCategoryDrawer.open);
	const adminLanguageDrawer = useSelector((state) => state.adminLanguageDrawer.open);



	useEffect(() => {
		router();
	}, []);
	let hash = window.location.hash;
	if (!hash.match(/#id_token/)) {
		if (cookies['id_token'] === undefined ||
			cookies['id_token'] === "null") {
			window.location = `https://${resources.cognitoURL}/login?response_type=token&client_id=${resources.poolClientId}&redirect_uri=${window.location.protocol}//${window.location.host}/Admin/`;
		}
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

		if (location.pathname.match('/System/')&&systemConfigDrawer===false) {
			dispatch(openSystemConfigDrawer());
			return;
		}

		if (location.pathname.match('/Pages/')&&adminPageDrawer===false) {
			dispatch(openAdminPageDrawer());
			return;
		}

		if (location.pathname.match('/Upload/')&&adminUploadDrawer===false) {
			dispatch(openUploadDrawer());
			return
		}

		if (location.pathname.match('/Category/')&&adminCategoryDrawer===false) {
			dispatch(openAdminCategoryDrawer());
			return
		}

		if (location.pathname.match('/Language/')&&adminLanguageDrawer===false) {
			dispatch(openLanguageDrawer());
			return
		}

		dispatch(openSystemConfigDrawer());

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
				<AdminSystemConfigDrawer></AdminSystemConfigDrawer>
				<AdminPageDrawer></AdminPageDrawer>
				<AdminDashboardDrawer></AdminDashboardDrawer>
				<AdminCategoryConfigDrawer/>
				<AdminLanguageDrawer/>

			</Box>
		</Box>
		</ThemeProvider>

	);
};


export default Admin;