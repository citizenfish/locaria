import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import Button from "@mui/material/Button";
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import MDEditor from "@uiw/react-md-editor";
import {useCookies} from "react-cookie";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "../components/tabs/tabPanel";
import TokenCheck from "../components/utils/tokenCheck";


export default function AdminContentPagesEdit() {

	const history = useHistory();
	const page = useSelector((state) => state.adminPageDrawer.page);
	const [pageData, setPageData] = useState({});
	const [markdown, setMarkdown] = useState("");
	const [currentTab, setCurrrentTab] = useState(0);
	const [cookies, setCookies] = useCookies(['id_token']);



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

	const savePage = () => {
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
					"data": markdown,
					"title": pageData.title
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
					"data": markdown,
					"title": pageData.title
				}
			}
		});
	}

	useEffect(() => {

		window.websocket.registerQueue('setPageData', (json) => {
			history.push(`/Admin/Content/Pages`);
		});

		window.websocket.registerQueue('setPageTempData', (json) => {
			// how to we stop the iframe?
			document.getElementById('iframeSet').setAttribute("src",`/${page}/#preview=true`);
		});

		window.websocket.registerQueue('getPageData', (json) => {
			let data = {data: "# New file", type: "Markdown", title: "My page title"};
			if (json.packet.parameters[page])
				data = json.packet.parameters[page];
			setPageData(data);
			setMarkdown(data.data);
		});
		if (page !== undefined) {
			getPageData();
		}

	}, [page]);

	const handleTabChange = (event, value) => {
		setCurrrentTab(value);
		//Preview
		if(value===1) {
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
					<Tabs value={currentTab} onChange={(e,v)=>{handleTabChange(e,v)}} aria-label="basic tabs example">
						<Tab label="Code view"/>
						<Tab label="Preview"/>
					</Tabs>
				</Box>
				<TabPanel value={currentTab} index={0}>
					<h1>Page Editor</h1>

					<MDEditor
						id={"pageData"}
						value={markdown}
						onChange={setMarkdown}
						height={500}
						style={{
							borderTopLeftRadius: 0,
							borderTopRightRadius: 0,
						}}
					/>
				</TabPanel>
				<TabPanel value={currentTab} index={1}>
					<h1>Page Preview</h1>
					<iframe id="iframeSet" style={{"min-width":"800px","min-height":"600px","width": "100%","height":"70vh","border":"1px solid black"}}/>

				{/*	{markdown &&
						<Box>
							<RenderMarkdown markdown={markdown}/>
						</Box>
					}*/}
				</TabPanel>


				<Box sx={{paddingTop: "10px"}}>
					<Button variant={"contained"} color="success" onClick={() => {
						history.push(`/Admin/Content/Pages`);
						savePage();
					}}>Save</Button>
					<Button variant={"contained"} color="error" onClick={() => {
						history.push(`/Admin/Content/Pages`);
					}}>Cancel</Button>
				</Box>



			</Box>
		</Box>
	)
}