import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import Button from "@mui/material/Button";
import PageSelector from "../components/selectors/pageSelector";
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import TokenCheck from "../components/utils/tokenCheck";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import DialogContentText from "@mui/material/DialogContentText";

export default function AdminContentPages() {

	const history = useHistory();
	const page = useSelector((state) => state.adminPageDrawer.page);
	const [openAdd, setOpenAdd] = useState(false);
	const [name, setName] = useState(false);
	const [title, setTitle] = useState(false);

	const handleCloseAdd = () => {
		setOpenAdd(false);
	}

	const handleAddPage = () => {

	}

	return (
		<Box sx={{display: 'flex'}}>
			<TokenCheck></TokenCheck>
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
					<Button variant={"contained"} color="warning" onClick={()=>{setOpenAdd(true)}}>Add</Button>
					<Button variant={"contained"} color="error">Delete</Button>
				</Box>


				<Dialog open={openAdd} onClose={handleCloseAdd}>
					<DialogTitle>Add page</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Enter a page url & title
						</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="name"
							label="Page url"
							type="text"
							fullWidth
							variant="standard"
						/>
						<TextField
							autoFocus
							margin="dense"
							id="title"
							label="Page title"
							type="text"
							fullWidth
							variant="standard"
						/>
					</DialogContent>
					<DialogActions>
						<Button color="error" onClick={handleCloseAdd}>Cancel</Button>
						<Button color="success" onClick={handleCloseAdd}>Add</Button>
					</DialogActions>
				</Dialog>
			</Box>
		</Box>
	)
}