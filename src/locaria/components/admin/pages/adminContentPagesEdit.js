import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import Button from "@mui/material/Button";
import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useCookies} from "react-cookie";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "../components/tabs/tabPanel";
import TokenCheck from "../components/utils/tokenCheck";
import {Select, TextField} from "@mui/material";
import {useFormik} from "formik";
import * as yup from "yup";
import {setEditor, setPage, setPages} from "../redux/slices/adminPagesSlice";
import { Editor } from '@tinymce/tinymce-react';
import EditMarkdown from "../../widgets/markdown/editMarkdown";
import MdSerialize from "../../../libs/mdSerialize";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";


const validationSchemaEdit = yup.object({
	title: yup
		.string('Enter page title')
		.min(3, 'Title should 3 or more characters')
		.required('Title is required'),
	description: yup
		.string('Enter page description')
		.min(10, 'Description should 10 or more characters')
		.required('Description is required'),
});

const formGrid = {display:'flex',flexDirection:'row', alignItems:'center'}
const tfStyle = {
	style: {
		padding: 5
	}
}
export default function AdminContentPagesEdit() {

	const MD = new MdSerialize();

	const [groupNames, setGroupNames] = React.useState(["PUBLIC"]);

	const handleGroupChange = (e) => {
		setGroupNames(
			// On autofill we get a stringified value.
			typeof value === 'string' ? e.target.value.split(',') : e.target.value,
		);
	};

	const history = useHistory();
	let {selectedPage}=useParams();
	const page = useSelector((state) => state.adminPages.page);
	const [pageData, setPageData] = useState({});
	const [markdownData, setMarkdownData] = useState(undefined);
	const [currentTab, setCurrrentTab] = useState(0);
	const [cookies, setCookies] = useCookies(['id_token']);
	const dispatch = useDispatch()

	const formik = useFormik({
		initialValues: {
			title: "",
			description:"",
		},
		validationSchema: validationSchemaEdit,
		onSubmit: (values) => {
			savePage(values);
		},
	});

	const getPageData = () => {
		window.websocket.send({
			"queue": "getPageData",
			"api": "sapi",
			"data": {
				"method": "get_parameters",
				"parameter_name": page,
				id_token: cookies['id_token'],
				"send_acl" : "true"

			}
		});
	}

	const savePage = (values) => {

		let element=document.getElementById("EditorHTML");
		let obj=MD.parseHTML(element);
		dispatch(setEditor(undefined));

		debugger;

		window.websocket.send({
			"queue": "setPageData",
			"api": "sapi",
			"data": {
				"method": "set_parameters",
				"acl": {"view": groupNames, "delete": ["Admins"], "update": ["Admins"]},
				"parameter_name": page,
				id_token: cookies['id_token'],
				"usage": "Page",
				"parameters": {
					"data": obj,
					"title": values.title,
					"description": values.description
				}
			}
		});
	}

	const saveTempPage = () => {
		let element = document.getElementById("EditorHTML");
		let obj=MD.parseHTML(element);
		setMarkdownData(obj);
		window.websocket.send({
			"queue": "setPageTempData",
			"api": "sapi",
			"data": {
				"method": "set_parameters",
				"acl": {"view": ["Admins"], "delete": ["Admins"], "update": ["Admins"]},
				"parameter_name": `${page}-${cookies['id_token']}`,
				id_token: cookies['id_token'],
				"usage": "Temp",
				"parameters": {
					"data": obj,
					"title": pageData.title,
					"description": pageData.description,

				}
			}
		});
	}

	useEffect(() => {
		window.websocket.registerQueue('setPageData', (json) => {
			dispatch(setPages(undefined));
			history.push(`/Admin/Content/Pages`);

		});

		window.websocket.registerQueue('setPageTempData', (json) => {
			// how to we stop the iframe?
			document.getElementById('iframeSet').setAttribute("src", `/${page}/#preview=true`);
		});

		window.websocket.registerQueue('getPageData', (json) => {
			let data = {data: "# New file", type: "Markdown", title: "My page title"};
			if (json&&json.packet&&json.packet.parameters&&json.packet.parameters[page])
				data = json.packet.parameters[page];
			setPageData(data);
			setGroupNames(data['_acl'].view?data['_acl'].view:["PUBLIC"]);
			setMarkdownData(data.data);
			formik.setFieldValue("title",data.title);
			formik.setFieldValue("description",data.description);
		});
		if (page !== "" && page !== undefined) {
			getPageData();
		} else {
			dispatch(setPage(selectedPage));
		}

	}, [page]);

	const handleTabChange = (value) => {
		setCurrrentTab(value);
		//Preview
		if (value === 1) {
			saveTempPage();
		}
	}


	return (
		<Box sx={{display: 'flex'}}>
			<TokenCheck></TokenCheck>
			<AdminAppBar title={`Content - Pages`}/>
			<LeftNav isOpenContent={true}/>
			<Box
				component="main"
				sx={{flexGrow: 1, marginTop: '60px'}}>
				<form onSubmit={formik.handleSubmit} >

					<Grid container spacing={2} sx={{mt:1, p:3}}>
						{currentTab === 0 &&
						<>
							<Grid item md={1}>
								<Button sx={{marginRight:"5px"}}
										variant="outlined"
										color="warning"
										onClick={() => {
											//TODO are you sure dialogue
											history.push(`/Admin/Content/Pages`);
										}}>
									Cancel
								</Button>
							</Grid>
							<Grid item md={1}>
								<Button variant="outlined"
										color="success"
										type="submit"
										onClick={() => {
											//TODO are you sure dialogue
										}}>
									Save
								</Button>
							</Grid>
							<Grid item md={1}>
								<Button sx={{marginRight:"5px"}}
										variant="outlined"
										color="error"
										onClick={() => {
											//TODO are you sure dialogue
											let element=document.getElementById("EditorHTML");
											element.innerText="\n";
										}}>
									Clear
								</Button>
							</Grid>
						</>
						}
						<Grid item md={1}>
							<Button sx={{marginRight:"5px"}}
									variant="outlined"
									color="error"
									onClick={() => {
										handleTabChange(currentTab === 0 ? 1 : 0)
									}}>
								{ currentTab === 0 ? 'Preview' : 'Editor' }
							</Button>
						</Grid>
						<Grid item md={8}>
							<Typography>The page editor allows you to create pages for viewing from the locaria website. Pages are comprised of formatted text and embedded components. Components are configured using parameters passed to them. A page can be previewed in the preview window.</Typography>
						</Grid>
					</Grid >
					<TabPanel value={currentTab} index={0}>
							<Box sx={{border: 1, borderRadius: 1, p: 2}}>
							<Grid container spacing={2}>
								<Grid item md={6} sx={formGrid}>
									<span style={{marginRight: 20}}>
										Title:
									</span>

									<TextField
										sx={{flexGrow:1}}
										inputProps={tfStyle}
										margin="dense"
										id="title"
										//label="Page title"
										type="text"
										fullWidth
										variant="outlined"
										value={formik.values.title}
										onChange={formik.handleChange}
										error={formik.touched.title && Boolean(formik.errors.title)}
										helperText={formik.touched.title && formik.errors.title}
									/>
								</Grid>

								<Grid item md={6} sx={formGrid}>
									<span style={{marginRight: 20}}>
									ACL:
									</span>
									<Select multiple value={groupNames}
											onChange={handleGroupChange}
											SelectDisplayProps={{style:{
												padding: 5,
												paddingRight: 50
												}}}
									>
										<MenuItem key={"permAdmin"} value={"Admins"}>Admins</MenuItem>
										<MenuItem key={"permUser"} value={"Users"}>Users</MenuItem>
										<MenuItem key={"permPublic"} value={"PUBLIC"}>PUBLIC</MenuItem>
									</Select>
								</Grid>

								<Grid item md={6} sx={formGrid}>
									<span style={{marginRight: 20}}>
									Description:
									</span>
									<TextField
										margin="dense"
										id="description"
										inputProps={tfStyle}
										type="text"
										fullWidth
										variant="outlined"
										value={formik.values.description}
										onChange={formik.handleChange}
										error={formik.touched.description && Boolean(formik.errors.description)}
										helperText={formik.touched.description && formik.errors.description}
									/>
								</Grid>
							</Grid>
							</Box>
							<Box
								component="main"
								sx={{flexGrow: 1, mt: 2}}
							>
								{
									markdownData !== undefined &&
									<EditMarkdown id={"EditorHTML"}
												  mode={"wysiwyg"}
												  documentObj={markdownData} />
								}
							</Box>


					</TabPanel>
					<TabPanel value={currentTab} index={1}>
						<iframe id="iframeSet" style={{
							minWidth: "800px",
							minHeight: "600px",
							width: "100%",
							height: "70vh",
							border: "1px solid black"
						}}/>
					</TabPanel>
				</form>
			</Box>
			</Box>
	)
}
