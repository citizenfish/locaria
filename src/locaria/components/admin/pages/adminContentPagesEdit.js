import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import Button from "@mui/material/Button";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import MDEditor from "@uiw/react-md-editor";
import {useCookies} from "react-cookie";
import RenderMarkdown from "../../widgets/markdown/renderMarkdown";

export default function AdminContentPagesEdit() {

	const history = useHistory();
	const page = useSelector((state) => state.adminPageDrawer.page);
	const [pageData, setPageData] = useState({});
	const [markdown, setMarkdown] = useState("");
	const [cookies, setCookies] = useCookies(['location']);


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

	useEffect(() => {

		window.websocket.registerQueue('setPageData', (json) => {
			history.push(`/Admin/Content/Pages`);
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

	return (
		<Box sx={{display: 'flex'}}>
			<AdminAppBar title={`Content - Pages`}/>
			<LeftNav isOpenContent={true}/>
			<Box
				component="main"
				sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '40px'}}
			>

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


				<Box sx={{paddingTop: "10px"}}>
					<Button variant={"contained"} color="success" onClick={() => {
						history.push(`/Admin/Content/Pages`);
						savePage();
					}}>Save</Button>
					<Button variant={"contained"} color="error" onClick={() => {
						history.push(`/Admin/Content/Pages`);
					}}>Cancel</Button>
				</Box>

				{markdown &&
					<Box>
						<RenderMarkdown markdown={markdown}/>
					</Box>
				}

			</Box>
		</Box>
	)
}