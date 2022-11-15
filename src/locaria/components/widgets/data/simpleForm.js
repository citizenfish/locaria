import React, {useEffect, useState} from 'react';
import {FieldView} from "./fieldView";
import Button from "@mui/material/Button";
import {FormFieldsToData,FormFieldsCheckRequired} from "./formFieldsToData";
import TypographyHeader from "../typography/typographyHeader";
import {useCookies} from "react-cookie";
import Box from "@mui/material/Box";
import {useSelector} from "react-redux";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import DialogContentText from "@mui/material/DialogContentText";
import {useHistory, useParams} from "react-router-dom";

export default function SimpleForm({category}) {

	const [submitted, setSubmitted] = useState(false);
	const [cookies, setCookies] = useCookies(['cookies']);
	const [dialogOpen, setDialogOpen] = useState(false);
	let {page} = useParams();
	const history = useHistory();

	const formData = useSelector((state) => state.formSlice.formData);

	let fakeData = {
		properties: {
			category: category
		}
	}

	useEffect(() => {

		window.websocket.registerQueue("submitForm", function (json) {
			// after submit
			setSubmitted(true);
		});
	}, []);

	const handleCloseDialog = () => {
		setDialogOpen(false);
	}

	const submitForm = () => {

		let data = FormFieldsToData(category, formData);
		let complete = FormFieldsCheckRequired(formData);

		let channel = window.systemCategories.getChannelProperties(category);
		let geometry = undefined;

		/*if (data.geometry) {
			geometry = data.geometry;
			delete data.geometry;
		}*/
		/*if (!data.data)
			data.data = {};*/
		let packet = {
			queue: "submitForm",
			api: "api",
			data: {
				method: "add_item",
				attributes: data.properties,
				id_token: cookies['id_token'],
				category: category,
				table: channel.table
			}
		};

		if (data.geometry !== undefined) {
			packet.data.geometry =data.geometry;
		}

		if(complete) {
			window.websocket.send(packet);
		} else {
			setDialogOpen(true);
		}
	}
	if (submitted === true) {
		history.push(`/${page}Submit/`);
		return (
			<TypographyHeader element={"h1"}>Submitted</TypographyHeader>
		)
	} else {
		return (
			<Box sx={{
				color: "black"
			}}>
				<FieldView data={fakeData} mode={"write"}></FieldView>
				<Button type={"submit"} variant={"contained"} sx={{
					marginTop: "10px",
					backgroundColor: window.systemMain.headerBackground,
					borderRadius: "0px",
					paddingLeft: "30px",
					paddingRight: "30px",
					"&:hover": {
						backgroundColor: window.systemMain.headerBackground
					}

				}} onClick={submitForm}>
					Submit
				</Button>
				<Dialog open={dialogOpen} onClose={handleCloseDialog}>
					<DialogTitle>Required fields</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Please complete the required fields
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button color="success" onClick={handleCloseDialog}>Ok</Button>
					</DialogActions>
				</Dialog>
			</Box>
		)
	}
}