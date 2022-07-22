import React, {useEffect} from 'react';
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import Button from "@mui/material/Button";
import PageSelector from "../components/selectors/pageSelector";
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";

export default function AdminContentPages() {

	const history = useHistory();
	const page = useSelector((state) => state.adminPageDrawer.page);

	return (
		<Box sx={{display: 'flex'}}>
			<AdminAppBar title={`Content - Pages`}/>
			<LeftNav isOpenContent={true}/>
			<Box
				component="main"
				sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '40px'}}
			>

				<h1>Page manager</h1>
				<p>Select a page to edit or delete</p>
				<PageSelector></PageSelector>
				<Box sx={{paddingTop:"10px"}}>
					<Button disabled={page? false:true} variant={"contained"} color="success" onClick={() => {
						if(page!==undefined) {
							history.push(`/Admin/Content/Pages/Edit`);
						}
					}}>Edit</Button>
					<Button variant={"contained"} color="error">Delete</Button>
				</Box>
			</Box>
		</Box>
	)
}