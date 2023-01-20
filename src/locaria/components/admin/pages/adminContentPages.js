import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import Button from "@mui/material/Button";
import PageSelector from "../components/selectors/pageSelector";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import TokenCheck from "widgets/utils/tokenCheck";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import DialogContentText from "@mui/material/DialogContentText";
import {useFormik} from "formik";
import * as yup from 'yup';
import {setPage, setPages} from "../redux/slices/adminPagesSlice";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid"


const validationSchemaAdd = yup.object({
	url: yup
		.string('Enter page url')
		.min(3, 'Url should 3 of more characters')
		.required('Url is required'),
	title: yup
		.string('Enter page title')
		.min(3, 'Title should 3 of more characters')
		.required('Title is required'),
});

export default function AdminContentPages() {

	const history = useHistory();
	const page = useSelector((state) => state.adminPages.page);
	const [openAdd, setOpenAdd] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const dispatch = useDispatch()
	const idToken = useSelector((state) => state.userSlice.idToken);

	useEffect(() => {

		window.websocket.registerQueue('addPageData', (json) => {
			setOpenAdd(false);
			dispatch(setPages(undefined));
			history.push(`/Admin/Content/Pages/Edit`);
		});

		window.websocket.registerQueue('deletePageData', (json) => {
			setOpenDelete(false);
			dispatch(setPages(undefined));
			dispatch(setPage(undefined));
		});
	});

	const handleCloseAdd = () => {
		setOpenAdd(false);
	}

	const handleCloseDelete = () => {
		setOpenDelete(false);
	}

	const handleAddPage = (values) => {
		dispatch(setPage(values.url));

		window.websocket.send({
			"queue": "addPageData",
			"api": "sapi",
			"data": {
				"method": "set_parameters",
				"acl": {"view": ["PUBLIC"], "delete": ["Admins"], "update": ["Admins"]},
				"parameter_name": values.url,
				id_token: idToken,
				"usage": "Page",
				"parameters": {
					"data": "# New Page title",
					"title": values.title
				}
			}
		});

	}

	const handleDeletePage = (values) => {

		window.websocket.send({
			"queue": "deletePageData",
			"api": "sapi",
			"data": {
				"method": "delete_parameters",
				"parameter_name": page,
				id_token: idToken,
				"usage": "Page"
			}
		});

	}

	const formik = useFormik({
		initialValues:{
			url:"",
			title:""
		},
		validationSchema: validationSchemaAdd,
		onSubmit: (values) => {
			handleAddPage(values)
		},
	});

	return (
		<Box sx={{display: 'flex'}}>
			<TokenCheck></TokenCheck>
			<AdminAppBar title={`Content - Pages`}/>

			<LeftNav isOpenContent={true}/>
			<Box
				component="main"
				sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '60px'}}
			>

				<Grid container spacing={2}>
					<Grid item md={4}>
						<Button sx={{marginRight:"5px"}} variant="outlined" color="success" onClick={() => {
							setOpenAdd(true)
						}}>Add New Page</Button>
					</Grid>
					<Grid item md={6}>
						<Typography>The page manager allows you to edit the static pages of your Locaria site. You can add, edit or delete pages from the site using this control. The "Home" page represents the first page of the site and all other pages are linked from this.  </Typography>
					</Grid>
				</Grid>

				<PageSelector setOpenDelete = {setOpenDelete}></PageSelector>

				<Dialog open={openDelete} onClose={handleCloseDelete}>
					<DialogTitle>Delete page</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Are you sure you want to delete the page <Typography sx={{display: "inline-block",fontWeight: 800}} variant={"subtitle1"}>{page}</Typography>?
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button color="success" onClick={handleCloseDelete}>Cancel</Button>
						<Button color="error" onClick={handleDeletePage}>Delete</Button>
					</DialogActions>
				</Dialog>

				<Dialog open={openAdd} onClose={handleCloseAdd}>
					<form onSubmit={formik.handleSubmit}>

						<DialogTitle>Add page</DialogTitle>
						<DialogContent>
							<DialogContentText>
								Enter a page url & title
							</DialogContentText>

							<TextField
								autoFocus
								margin="dense"
								id="url"
								label="Page url"
								type="text"
								fullWidth
								variant="standard"
								value={formik.values.url}
								onChange={formik.handleChange}
								error={formik.touched.url && Boolean(formik.errors.url)}
								helperText={formik.touched.url && formik.errors.url}
							/>
							<TextField
								margin="dense"
								id="title"
								label="Page title"
								type="text"
								fullWidth
								variant="standard"
								value={formik.values.title}
								onChange={formik.handleChange}
								error={formik.touched.title && Boolean(formik.errors.title)}
								helperText={formik.touched.title && formik.errors.title}
							/>
						</DialogContent>
						<DialogActions>
							<Button color="error" onClick={handleCloseAdd}>Cancel</Button>
							<Button color="success" type="submit">Add</Button>
						</DialogActions>
					</form>

				</Dialog>
			</Box>
		</Box>
	)
}