import React, {useEffect, useState} from 'react';
import {FieldView} from "./fieldView";
import Button from "@mui/material/Button";
import {FormFieldsToData, FormFieldsCheckRequired} from "./formFieldsToData";
import TypographyHeader from "../typography/typographyHeader";
import {useCookies} from "react-cookie";
import Box from "@mui/material/Box";
import {useDispatch, useSelector} from "react-redux";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import DialogContentText from "@mui/material/DialogContentText";
import {useHistory, useParams} from "react-router-dom";
import {clearSubmitted, formReset, setFormPage, submitForm} from "components/redux/slices/formSlice";

export default function SimpleForm({category, fields = "main"}) {

	const [cookies, setCookies] = useCookies(['id_token']);
	const [dialogOpen, setDialogOpen] = useState(false);
	let {page} = useParams();
	const history = useHistory();
	const formSubmitted = useSelector((state) => state.formSlice.formSubmitted);
	const formPageMode = useSelector((state) => state.formSlice.formPageMode);
	const formPage = useSelector((state) => state.formSlice.formPage);
	const dispatch = useDispatch()


	let fakeData = {
		properties: {
			category: category
		}
	}

	useEffect(() => {
		window.websocket.registerQueue("submitForm", function (json) {
			// after submit
			history.push(`/${page}Submit/`);
		});


		if(formSubmitted!==undefined) {
			let channel = window.systemCategories.getChannelProperties(category);
			let fieldsData=channel.fields[fields];
			let data = FormFieldsToData(category, formSubmitted,fieldsData);
			let complete = FormFieldsCheckRequired(formSubmitted,fieldsData);


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
				packet.data.geometry = data.geometry;
			}

			if (complete) {
				dispatch(clearSubmitted());
				window.websocket.send(packet);
			} else {
				setDialogOpen(true);
			}
		}
	}, [formSubmitted]);

	const handleCloseDialog = () => {
		setDialogOpen(false);
	}

	const submitFormButton = () => {
		dispatch(submitForm());
	}

	if(formSubmitted===undefined) {
		return (
			<Box sx={{
				color: "black"
			}}>
				<FieldView data={fakeData} mode={"write"} fields={fields}></FieldView>
				{!formPageMode&&
					<Button type={"submit"} variant={"contained"} sx={{
						marginTop: "10px",
						backgroundColor: window.systemMain.headerBackground,
						borderRadius: "0px",
						paddingLeft: "30px",
						paddingRight: "30px",
						"&:hover": {
							backgroundColor: window.systemMain.headerBackground
						}

					}} onClick={()=>{submitFormButton();}}>
						Submit
					</Button>
				}
				{formPageMode&&
					<Button type={"submit"} variant={"contained"} sx={{
						marginTop: "10px",
						backgroundColor: window.systemMain.headerBackground,
						borderRadius: "0px",
						paddingLeft: "30px",
						paddingRight: "30px",
						"&:hover": {
							backgroundColor: window.systemMain.headerBackground
						}

					}} onClick={()=>{dispatch(setFormPage(formPage+1))}}>
						Next
					</Button>
				}
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
	} else {
		return (<></>);
	}
}