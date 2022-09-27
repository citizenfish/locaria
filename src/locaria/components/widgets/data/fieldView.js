import React, {useRef} from 'react';
import {useStyles} from 'theme/styles';
import Grid from "@mui/material/Grid";

import DataItemTitle from "./dataItemsRead/dataItemTitle";
import DataItemDescription from "./dataItemsRead/dataItemDescription";
import DataItemH2 from "./dataItemsRead/dataItemH2";
import dataItemMarkdown from "./dataItemsRead/dataItemMarkdown";
import DataItemTextInput from "./dataItemsWrite/dataItemTextInput";
import dataItemEditMarkdown from "./dataItemsWrite/dataItemEditMarkdown";
import Box from "@mui/material/Box";
import DataItemP from "./dataItemsRead/dataItemP";
import DataItemSelect from "./dataItemsWrite/dataItemSelect";
import DataItemSubCategory from "./dataItemsWrite/dataItemSubCategory";
import DataItemDateInput from "./dataItemsWrite/dataItemDateInput";
import DataItemMap from "./dataItemsWrite/dataItemMap";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DataItemUpload from "./dataItemsWrite/dataItemUpload";

const FieldView = ({data, mode}) => {




	if (data && data.properties && data.properties.category) {

		let channel = window.systemCategories.getChannelProperties(data.properties.category);

		let fields = channel.fields;

		if (fields) {
			return (
				<Box sx={{
					p: 2
				}}>
					<Grid container>
						<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"GB"}>

						{fields.main ?
							<FormatFields fields={fields.main}
										  data={data}
										  mode={mode || 'read'}/> : null}
						</LocalizationProvider>
					</Grid>
				</Box>
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
		return (<>
			{fields.map(value => {
					if (value.visible !== false || mode === "write")
						return (
							<Grid item md={12}>

								<FormatField field={value}
											 data={data}
											 key={value.key}
											 mode={mode}/>
							</Grid>)
				}
			)}
		</>);
	}
	return null;

}

const FormatField = ({field, data, mode}) => {

	let dataActual = getData(data, field.key, field.dataFunction);

	if (mode === 'read' && (dataActual === undefined || dataActual === "" || dataActual === null)) {
		return (<></>);
	}

	const dataReadItems = {
		'title': {"element": DataItemTitle},
		'description': {"element": DataItemDescription},
		'p': {"element": DataItemP},
		'h2': {"element": DataItemH2},
		'md': {"element": dataItemMarkdown}
	}

	const dataWriteItem = {
		'title': {"element": DataItemTextInput},
		'description': {"element": DataItemTextInput},
		'p': {"element": DataItemTextInput},
		'h2': {"element": DataItemTextInput},
		'md': {"element": dataItemEditMarkdown, options: {simple: true}},
		'select': {"element": DataItemSelect},
		'subCategory': {"element": DataItemSubCategory},
		'date': {"element": DataItemDateInput},
		'map': {"element": DataItemMap},
		'upload': {"element": DataItemUpload},
	}

	let options = {};
	let Element = (<></>);

	options = field.options;

	if (mode === 'read' && dataReadItems[field.read]) {
		Element = dataReadItems[field.read].element;
		options = {...dataReadItems[field.read].options, ...field.options};
	}

	if (mode === 'write') {
		if (field.write && dataWriteItem[field.write]) {
			Element = dataWriteItem[field.write].element;
			options = {...dataWriteItem[field.write].options, ...field.options};
		} else {
			Element = DataItemTextInput;
		}
	}

	return (
		<Element id={field.key}
				 name={field.name}
				 required={field.required}
				 data={dataActual}
				 prompt={field.prompt}
				 sx={field.sx}
				 {...options}
		/>
	)

	/*if (dataItems[field.display] && dataItems[field.display][mode]) {
		//let Element = dataItems[field.display][mode];
		return (
			<Element id={field.key}
					 name={field.name}
					 data={dataActual}
					 sx={field.sx}
					 {...dataItems[field.display].options}
			/>
		)
	} else {
		return (
			<></>
		)
	}*/

}

const safeEval = (str, data) => {
	let jData = JSON.stringify(data);
	let call = `'use strict'; const data=${jData}; return (${str})`;
	return window.Function(call)();
}

const getData = (data, path, func) => {
	let result;
	const classes = useStyles();

	if (func) {
		return func(data, classes);
	}


	try {
		result = safeEval(`data.${path}`, data);
	} catch (e) {
		//console.log(e);
		return "";
	}
	return result;
}

export {FieldView, FormatField};
