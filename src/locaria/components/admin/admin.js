import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import AdminAppBar from './adminAppBar'
import {useStyles} from 'stylesLocaria';
import AdminNavigator from './adminNavigator'

import {useCookies} from "react-cookie";
import {configs, resources} from "themeLocaria";
import {useSelector} from "react-redux";
const drawerWidth = 240


const Admin= () => {



	function RunComponent(props) {
		const Comp = props.comp;
		return <Comp/>;
	}

	const selectedComponent = useSelector((state) => state.admin.selectedComponent);
	const [component,setComponent] = useState('upload')
	const [cookies, setCookies] = useCookies(['location'])

	if(cookies['id_token'] === undefined ||
	   cookies['id_token'] === "null") {
		window.location = `https://${resources.cognitoURL}/login?response_type=token&client_id=${resources.poolClientId}&redirect_uri=${location.protocol}//${location.host}/`;
	}

	return (
		<Box sx={{ display: 'flex'}}>
			<AdminAppBar dw = {drawerWidth} mode = {component}/>
			<AdminNavigator dw = {drawerWidth} cm = {setComponent}/>
			<Box
				component="main"
				sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '140px'  }}
			>
				<RunComponent comp={selectedComponent.component}/>
			</Box>
		</Box>

	);
};


export default Admin;