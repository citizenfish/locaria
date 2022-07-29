import React from 'react';
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import {useParams} from "react-router-dom";
import TokenCheck from "../components/utils/tokenCheck";

export default function AdminContentData() {


	return (
		<Box sx={{display: 'flex'}}>
			<TokenCheck></TokenCheck>
			<AdminAppBar title={`Content - Data`}/>
			<LeftNav isOpenContent={true}/>
			<Box
				component="main"
				sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '40px'}}
			>
				<h1>Data manager</h1>
			</Box>
		</Box>
	)
}