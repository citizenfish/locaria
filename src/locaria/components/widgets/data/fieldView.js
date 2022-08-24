import React from 'react';
import {useStyles} from 'theme/styles';
import Grid from "@mui/material/Grid";

import DataItemTitle from "./dataItemsRead/dataItemTitle";
import DataItemDescription from "./dataItemsRead/dataItemDescription";
import DataItemH2 from "./dataItemsRead/dataItemH2";
import dataItemMarkdown from "./dataItemsRead/dataItemMarkdown";
import DataItemTextInput from "./dataItemsWrite/dataItemTextInput";
import dataItemEditMarkdown from "./dataItemsWrite/dataItemEditMarkdown";

const FieldView = ({data, mode}) => {

	if (data && data.category) {

		let channel = window.systemCategories.getChannelProperties(data.category);

		let fields = channel.fields;

		if (fields) {
			return (
				<>
					{fields.main ?
						<FormatFields fields={fields.main} data={data} mode={mode || 'read'}></FormatFields> : null}
				</>
			)
		} else {
			return (
				<Grid container spacing={2}>
					<Grid item md={12}>
						<h1>You have not configured data for category {data.category}</h1>
					</Grid>
				</Grid>
			)
		}
	} else {
		return (
			<Grid container spacing={2}>
				<Grid item md={12}>
					<h1>Data has no category</h1>
				</Grid>
			</Grid>
		)
	}

}

const FormatFields = ({fields, data, mode}) => {
	if (fields && fields.length > 0) {
		return (
			<>
				{fields.map(value => (
					<FormatField field={value} data={data} key={value.key} mode={mode}></FormatField>
				))}
			</>
		);
	}
	return null;

}

const FormatField = ({field, data, mode}) => {

	let dataActual = getData(data, field.key, field.dataFunction);

	if (mode === 'read' && (dataActual === undefined || dataActual === "" || dataActual === null)) {
		return (<></>);
	}

	const dataItems = {
		'title': {read: DataItemTitle, write: DataItemTextInput},
		'description': {read: DataItemDescription, write: DataItemTextInput},
		'h2': {read: DataItemH2, write: DataItemTextInput},
		'md': {read: dataItemMarkdown, write: dataItemEditMarkdown}
	}

	if (dataItems[field.display] && dataItems[field.display][mode]) {
		let Element = dataItems[field.display][mode];
		return (
			<Element id={field.key} name={field.name} data={dataActual} sx={field.sx}/>
		)
	} else {
		return (
			<></>
		)
	}

}

const safeEval = (str, data) => {
	let jData = JSON.stringify(data);
	let call = `'use strict'; const data=${jData}; return (${str})`;
	return window.Function(call)();
}

const getData = (data, path, func) => {
	let result;
	const classes = useStyles();

	if (func)
		return func(data, classes);

	try {
		result = safeEval(path, data);
	} catch (e) {
		console.log(e);
		return "";
	}
	return result;
}

export {FieldView, FormatField};
