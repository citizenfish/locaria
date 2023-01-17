import React, {useState} from 'react';
import TokenCheck from "widgets/utils/tokenCheck";
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
import { updateStyle} from "../redux/slices/adminPagesSlice";
import {useCookies} from "react-cookie";
import * as yup from "yup";
import {useFormik} from "formik";
import Grid from "@mui/material/Grid";
import RenderMarkdown from "../../widgets/markdown/renderMarkdown";

const validationSchemaAdd = yup.object({
	name: yup
		.string('Enter style name')
		.min(3, 'Name should 3 of more characters')
		.required('Name is required')

});

export default function AdminSettingsAppearance() {
	const history = useHistory();
	const [openDelete, setOpenDelete] = useState(false)
	const [openAdd, setOpenAdd] = useState(false)
	const [openPreview, setOpenPreview] = useState(false)

	const dispatch = useDispatch()
	const [cookies, setCookies] = useCookies(['id_token'])

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

	const makeStyle = () => {
		return JSON.stringify(window.systemMain.styles[style]);
	}

	return (
		<Box sx={{display: 'flex'}}>
			<TokenCheck></TokenCheck>
			<AdminAppBar title={`Site Manager`}/>
			<LeftNav isOpenSettings={true}/>
			<Box
				component="main"
				sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '60px'}}
			>

				<Grid container spacing={2}>
					<Grid item md={4}>
						<Button sx={{marginRight:"5px"}}
								variant="outlined"
								color="success"
								onClick={() => {
									setOpenAdd(true)
								}}>
							Add Style
						</Button>
					</Grid>
					<Grid item md={6}>
						<Typography>The site  manager allows you to edit site style.</Typography>
					</Grid>
				</Grid>

				<StyleSelector setOpenDelete={setOpenDelete} setOpenPreview={setOpenPreview}/>

			</Box>

			<Dialog open={openPreview}>
				<DialogTitle>Preview {style}</DialogTitle>
				<DialogContent>
					<RenderMarkdown markdown={`${makeStyle()}# H1 Heading\n${makeStyle()}## H2 Heading\n${makeStyle()}### H3 Heading\n\n${makeStyle()}This is how a normal paragraph will appear`}></RenderMarkdown>
				</DialogContent>
				<DialogActions>
					<Button color="success" onClick={() => {setOpenPreview(false)}}>Close</Button>
				</DialogActions>
			</Dialog>


			<Dialog open={openDelete} onClose={handleCloseDelete}>
				<DialogTitle>Delete Style</DialogTitle>
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
