import React from 'react';
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import Box from "@mui/material/Box";
import TokenCheck from "../components/utils/tokenCheck";

export default function AdminHome() {
	return (
		<Box sx={{display: 'flex'}}>
			<TokenCheck></TokenCheck>
			<AdminAppBar title={"Home"}/>
			<LeftNav/>
			<Box
				component="main"
				sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '40px'}}
			>
			<h1>Home</h1>
			</Box>
		</Box>
	)
}