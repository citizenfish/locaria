import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import Button from "@mui/material/Button";
import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useCookies} from "react-cookie";
import TokenCheck from "widgets/utils/tokenCheck";
import {setConfig, setConfigs} from "../redux/slices/adminPagesSlice";
import Grid from "@mui/material/Grid";
import {Editor} from 'material-jsoneditor';


export default function AdminConfigParameters() {


	const history = useHistory();
	let {selectedConfig} = useParams();
	const config = useSelector((state) => state.adminPages.config);
	const [configData, setConfigData] = useState({});
	const [cookies, setCookies] = useCookies(['id_token']);
	const dispatch = useDispatch()


	const getConfigData = () => {
		window.websocket.send({
			"queue": "getConfigData",
			"api": "sapi",
			"data": {
				"method": "get_parameters",
				"parameter_name": config,
				id_token: cookies['id_token'],
				"send_acl": "true"

			}
		});
	}

	const saveConfig = (values) => {

		window.websocket.send({
			"queue": "setPageData",
			"api": "sapi",
			"data": {
				"method": "set_parameters",
				"acl": {"delete": ["Admins"], "update": ["Admins"]},
				"parameter_name": config,
				id_token: cookies['id_token'],
				"usage": "Config",
				"parameters": configData
			}
		});
	}


	useEffect(() => {
		window.websocket.registerQueue('setPageData', (json) => {
			dispatch(setConfigs(undefined));
			history.push(`/Admin/Config`);

		});


		window.websocket.registerQueue('getConfigData', (json) => {
			let data = {};
			if (json && json.packet && json.packet.parameters && json.packet.parameters[config]) {
				data = json.packet.parameters[config].data;
			}
			setConfigData(data);

		});
		if (config !== "" && config !== undefined) {
			getConfigData();
		} else {
			dispatch(setConfig(selectedConfig));
		}

	}, [config]);


	return (
		<Box sx={{display: 'flex'}}>
			<TokenCheck></TokenCheck>
			<AdminAppBar title={`Configure - Parameters`}/>
			<LeftNav isOpenConfig={true}/>
			<Box
				component="main"
				sx={{marginTop: '60px',width:"100%"}}>
				<Grid container spacing={1}
					  sx={{mt: 1, p: 3}}>
					<Grid item md={3}>
						<Button
							variant="outlined"
							color="warning"
							onClick={() => {
								//TODO are you sure dialogue
								history.push(`/Admin/Config`);
							}}>
							Cancel
						</Button>
					</Grid>
					<Grid item md={3}>
						<Button variant="outlined"
								color="success"
								type="submit"
								onClick={() => {
									saveConfig();
									//TODO are you sure dialogue
								}}>
							Save
						</Button>
					</Grid>
					<Grid item md={3}>
						<Button
							variant="outlined"
							color="error"
							onClick={() => {
								//TODO are you sure dialogue
								let element = document.getElementById("EditorHTML");
								element.innerText = "\n";
							}}>
							Clear
						</Button>
					</Grid>
					<Grid display="flex" item md={12} sx={{padding: 1, height: "80vh"}}>
						<Editor value={configData} onChange={setConfigData}></Editor>
					</Grid>
				</Grid>
			</Box>
		</Box>
	)
}
