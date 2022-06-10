import React from 'react';
import {useStyles} from 'theme/styles';
import Grid from "@mui/material/Grid";

import DataItemTitle from "./dataItems/dataItemTitle";
import DataItemDescription from "./dataItems/dataItemDescription";
import DataItemH2 from "./dataItems/dataItemH2";

const FieldView = ({data}) => {

	let channel = window.systemCategories.getChannelProperties(data.category);

	let fields = channel.fields;

	if (fields) {
		return (
			<>
				{fields.main ? <FormatFields fields={fields.main} data={data}></FormatFields> : null}
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

}

const FormatFields = ({fields, data}) => {

	if (fields && fields.length > 0) {
		return (
			<>
			{fields.map(value => (
				<FormatField field={value} data={data} key={value.key}></FormatField>
			))}
			</>
		);
	}
	return null;

}

const FormatField = ({field, data}) => {

	let dataActual = getData(data, field.key, field.dataFunction);


	if (dataActual === undefined || dataActual === "" || dataActual === null) {
		return (<></>);
	}

	const dataItems={
		'title':DataItemTitle,
		'description':DataItemDescription,
		'h2':DataItemH2
	}

	if(dataItems[field.display]) {
		let Element = dataItems[field.display];

		return (
			<Element name={field.name} data={dataActual}/>
		)
	} else {
		return (
			<></>
		)
	}

}

const getData = (data, path, func) => {
	let result;
	const classes = useStyles();

	if (func)
		return func(data, classes);

	try {
		result = eval('data.' + path);
	} catch (e) {
		console.log(e);
		return "";
	}
	return result;
}

export {FieldView, FormatField};
