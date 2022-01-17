import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import {useStyles} from 'stylesLocaria';


import AdminLayout from './adminLayout';
import AdminCard from "./adminCard";
import {TextField} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import {useCookies} from "react-cookie";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";

const AdminLoader = () => {
	const classes = useStyles();
	const [cookies, setCookies] = useCookies(['location']);

	function sendWS() {
		let data = JSON.parse(document.getElementById('sendWS').value);
		data["id_token"] = cookies['id_token'];
		window.websocket.send({
			"queue": "sendWS",
			"api": "lapi",
			"method": document.getElementById('method').value,
			"data": data
		});
	}

	return (
		<AdminLayout>
			<Grid container className={classes.root} spacing={6}>
				<Grid item md={4}>
					<Paper elevation={3} className={classes.paperMargin}>
						<AdminCard></AdminCard>
					</Paper>
				</Grid>
				<Grid item md={8}>
					<Paper elevation={3} className={classes.paperMargin}>
						<h1>Loader</h1>
						<FormControl className={classes.formControl} fullWidth>
							<InputLabel id={'method-label'}>Method</InputLabel>
							<Input type="text" labelId={'method-label'} id={"method"}
							       defaultValue={"start"}
							       name={"method"}/>
						</FormControl>
						<FormControl className={classes.formControl} fullWidth>
							<TextField
								placeholder="stuff"
								multiline
								rows={10}
								rowsMax={4}
								id={"sendWS"}
							/>
						</FormControl>
						<Button size="small" color="secondary" onClick={sendWS} variant="outlined">
							Send
						</Button>
					</Paper>
				</Grid>
			</Grid>
		</AdminLayout>
	);
};


export default AdminLoader;