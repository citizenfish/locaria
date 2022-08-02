import React, {useState} from 'react';
import TokenCheck from "../components/utils/tokenCheck";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import Box from "@mui/material/Box";
import StyleSelector from "../components/selectors/styleSelector";
import Button from "@mui/material/Button";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";
import {setPage, setStyle, updateStyle} from "../redux/slices/adminPagesSlice";
import {useCookies} from "react-cookie";
import * as yup from "yup";
import {useFormik} from "formik";

const validationSchemaAdd = yup.object({
	name: yup
		.string('Enter style name')
		.min(3, 'Name should 3 of more characters')
		.required('Name is required')

});

export default function AdminSettingsAppearance() {
	const history = useHistory();
	const [openDelete, setOpenDelete] = useState(false);
	const [openAdd, setOpenAdd] = useState(false);

	const dispatch = useDispatch()
	const [cookies, setCookies] = useCookies(['id_token']);

	const style = useSelector((state) => state.adminPages.style);

	const handleCloseDelete = () => {
		setOpenDelete(false);
	}

	const handleDeletePage = (values) => {
		dispatch(updateStyle({style: style, purge: style, token: cookies["id_token"]}));
		setOpenDelete(false);

	}

	const handleCloseAdd = () => {
		setOpenAdd(false);
	}

	const handleAddPage = (values) => {
		dispatch(updateStyle({style: values.name, add: true, token: cookies["id_token"]}));
		setOpenAdd(false);
		history.push(`/Admin/Settings/Appearance/Edit`);

	}

	const formik = useFormik({
		initialValues:{
			name:""
		},
		validationSchema: validationSchemaAdd,
		onSubmit: (values) => {
			handleAddPage(values)
		},
	});

	return (
		<Box sx={{display: 'flex'}}>
			<TokenCheck></TokenCheck>
			<AdminAppBar title={`Settings - Appearance`}/>
			<LeftNav isOpenSettings={true}/>
			<Box
				component="main"
				sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '40px'}}
			>

				<h1>Appearance</h1>
				<StyleSelector></StyleSelector>
				<Box sx={{paddingTop: "10px"}}>
					<Button sx={{marginRight: "5px"}} disabled={style ? false : true} variant={"outlined"}
							color="success" onClick={() => {
						if (style !== undefined) {
							history.push(`/Admin/Settings/Appearance/Edit`);
						}
					}}>Edit</Button>
					<Button sx={{marginRight: "5px"}} variant={"outlined"} color="warning" onClick={() => {
						setOpenAdd(true)
					}}>Add</Button>
					<Button disabled={style ? false : true} variant={"outlined"} color="error" onClick={() => {
						setOpenDelete(true);
					}}>Delete</Button>
				</Box>

			</Box>

			<Dialog open={openDelete} onClose={handleCloseDelete}>
				<DialogTitle>Delete page</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete the style <Typography
						sx={{display: "inline-block", fontWeight: 800}} variant={"subtitle1"}>{style}</Typography>?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button color="success" onClick={handleCloseDelete}>Cancel</Button>
					<Button color="error" onClick={handleDeletePage}>Delete</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={openAdd} onClose={handleCloseAdd}>
				<form onSubmit={formik.handleSubmit}>

					<DialogTitle>Add style</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Enter a style name
						</DialogContentText>

						<TextField
							autoFocus
							margin="dense"
							id="name"
							label="Style name"
							type="text"
							fullWidth
							variant="standard"
							value={formik.values.name}
							onChange={formik.handleChange}
							error={formik.touched.name && Boolean(formik.errors.name)}
							helperText={formik.touched.name && formik.errors.name}
						/>
					</DialogContent>
					<DialogActions>
						<Button color="error" onClick={handleCloseAdd}>Cancel</Button>
						<Button color="success" type="submit">Add</Button>
					</DialogActions>
				</form>

			</Dialog>

		</Box>
	)
}