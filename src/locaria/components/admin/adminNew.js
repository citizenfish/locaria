import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import AdminAppBar from './adminHeader'
import {useStyles} from 'stylesLocaria';
import AdminNavigator from './adminNavigator'
import AdminUpload from './components/adminUpload'
import AdminEdit from './components/adminEdit'
import AdminModerate from "./components/adminModerate";
import AdminExport from "./components/adminExport";
import AdminUsers from "./components/adminUsers";
import AdminReports from "./components/adminReports";
import {useCookies} from "react-cookie";
import {configs, resources} from "themeLocaria";
const drawerWidth = 240


const AdminNew= () => {

	const [component,setComponent] = useState('upload')
	const [cookies, setCookies] = useCookies(['location'])

	if(cookies['id_token'] === undefined ||
	   cookies['id_token'] === "null") {
		window.location = `https://${resources.cognitoURL}/login?response_type=token&client_id=${resources.poolClientId}&redirect_uri=http://localhost:8080/`;
	}

	return (
		<Box sx={{ display: 'flex' }}>
			<AdminAppBar dw = {drawerWidth} mode = {component}/>
			<AdminNavigator dw = {drawerWidth} cm = {setComponent}/>
			<Box
				component="main"
				sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
			>
				<Toolbar />
				<Toolbar />
				{component == 'upload' && <AdminUpload />}
				{component == 'edit' && <AdminEdit/>}
				{component == 'moderate' && <AdminModerate/>}
				{component == 'export' && <AdminExport/>}
				{component == 'users' && <AdminUsers/>}
				{component == 'reports' && <AdminReports/>}
			</Box>
		</Box>

	);
};


export default AdminNew;