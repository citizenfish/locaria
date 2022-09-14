import React, {useEffect, useState} from 'react';
import {FieldView} from "./fieldView";
import Button from "@mui/material/Button";
import FormFieldsToData from "./formFieldsToData";
import TypographyHeader from "../typography/typographyHeader";
import {useCookies} from "react-cookie";

export default function SimpleForm({category}) {

	const [submitted,setSubmitted] = useState(false);
	const [cookies, setCookies] = useCookies(['cookies']);

	let fakeData={
			category: category
	}

	useEffect(() => {

		window.websocket.registerQueue("submitForm", function (json) {
			// after submit
			setSubmitted(true);
		});
	},[]);


	const submitForm= () => {
		let data = FormFieldsToData(category);
		let channel = window.systemCategories.getChannelProperties(category);

		if(!data.data)
			data.data={};
		let packet = {
			queue: "submitForm",
			api: "api",
			data: {
				method: "add_item",
				attributes: data,
				id_token: cookies['id_token'],
				category: category,
				table: channel.table
			}
		};

		window.websocket.send(packet);
	}
	if(submitted===true) {
		return (
			<TypographyHeader element={"h1"}>Submitted</TypographyHeader>
		)
	} else {
		return (
			<>
				<FieldView data={fakeData} mode={"write"}></FieldView>
				<Button onClick={submitForm}>Submit</Button>
			</>
		)
	}
}