import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import Button from "@mui/material/Button";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useCookies} from "react-cookie";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "../components/tabs/tabPanel";
import TokenCheck from "../components/utils/tokenCheck";
import {TextField} from "@mui/material";
import {useFormik} from "formik";
import * as yup from "yup";
import { setPages} from "../redux/slices/adminPagesSlice";
import { Editor } from '@tinymce/tinymce-react';
import EditMarkdown from "../../widgets/markdown/editMarkdown";


const validationSchemaEdit = yup.object({
	title: yup
		.string('Enter page title')
		.min(3, 'Title should 3 of more characters')
		.required('Title is required'),
});

export default function AdminContentPagesEdit() {

	const history = useHistory();
	const page = useSelector((state) => state.adminPages.page);
	const [pageData, setPageData] = useState({});
	const [markdownData, setMarkdownData] = useState(undefined);
	const [currentTab, setCurrrentTab] = useState(0);
	const [cookies, setCookies] = useCookies(['id_token']);
	const dispatch = useDispatch()

	const formik = useFormik({
		initialValues: {
			title: ""
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

			}
		});
	}

	const savePage = (values) => {
		window.websocket.send({
			"queue": "setPageData",
			"api": "sapi",
			"data": {
				"method": "set_parameters",
				"acl": "external",
				"parameter_name": page,
				id_token: cookies['id_token'],
				"usage": "Page",
				"parameters": {
					"data": markdownData,
					"title": values.title
				}
			}
		});
	}

	const saveTempPage = () => {
		window.websocket.send({
			"queue": "setPageTempData",
			"api": "sapi",
			"data": {
				"method": "set_parameters",
				"acl": "external",
				"parameter_name": `${page}-${cookies['id_token']}`,
				id_token: cookies['id_token'],
				"usage": "Temp",
				"parameters": {
					"data": markdownData,
					"title": pageData.title
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
			setMarkdownData(data.data);
			formik.setFieldValue("title",data.title);
		});
		if (page !== undefined) {
			getPageData();
		}

	}, [page]);

	const handleTabChange = (event, value) => {
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
				sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '40px'}}
			>


				<Box>
					<Tabs value={currentTab} onChange={(e, v) => {
						handleTabChange(e, v)
					}} aria-label="basic tabs example">
						<Tab label="Code view"/>
						<Tab label="Preview"/>
					</Tabs>
				</Box>
				<form onSubmit={formik.handleSubmit}>

					<TabPanel value={currentTab} index={0}>
						<h1>Page Editor</h1>
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
						{markdownData !== undefined &&
							<EditMarkdown document={markdownData} onChange={setMarkdownData}></EditMarkdown>
						}
					</TabPanel>
					<TabPanel value={currentTab} index={1}>
						<h1>Page Preview</h1>
						<iframe id="iframeSet" style={{
							minWidth: "800px",
							minHeight: "600px",
							width: "100%",
							height: "70vh",
							border: "1px solid black"
						}}/>
					</TabPanel>


					<Box sx={{paddingTop: "10px"}}>
						<Button variant={"contained"} color="success" type="submit" onClick={() => {

						}}>Save</Button>
						<Button variant={"contained"} color="error" onClick={() => {
							history.push(`/Admin/Content/Pages`);
						}}>Cancel</Button>
					</Box>
				</form>


			</Box>
		</Box>
	)
}