import React, {useState} from 'react';
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

const Admin= () => {

	const [cookies, setCookies] = useCookies(['location'])

	if(cookies['id_token'] === undefined ||
	   cookies['id_token'] === "null") {
		window.location = `https://${resources.cognitoURL}/login?response_type=token&client_id=${resources.poolClientId}&redirect_uri=${location.protocol}//${location.host}/`;
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