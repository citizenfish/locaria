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
const drawerWidth = 240


const AdminNew= () => {
	const classes = useStyles()
	const [component,setComponent] = useState('upload')

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
				{component == 'upload' && <AdminUpload cm = {setComponent}/>}
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