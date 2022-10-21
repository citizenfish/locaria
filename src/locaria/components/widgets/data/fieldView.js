import React from 'react';
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
import dataItemImages from "./dataItemsRead/dataItemImages";
import {
	DataItemSocialFacebook,
	DataItemSocialGeneric,
	DataItemSocialInstagram,
	DataItemSocialTwitter
} from "./dataItemsRead/dataItemSocial";
import DataItemGrid from "./dataItemsRead/dataItemGrid";
import Divider from "@mui/material/Divider";

const FieldView = ({data, mode='read',fields="main"}) => {




	if (data && data.properties && data.properties.category) {

		let channel = window.systemCategories.getChannelProperties(data.properties.category);

		let fieldsObj = channel.fields;

		if (fieldsObj) {
			return (
				<Box sx={{
					p: 2
				}}>
					<Grid container>
						<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"GB"}>

						{fieldsObj[fields] ?
							<FormatFields fields={fieldsObj[fields]}
										  data={data}
										  mode={mode}
										  category={data.properties.category}/> : null}
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

const FormatFields = ({fields, data, mode,category}) => {
	if (fields && fields.length > 0) {
		return (<>
			{fields.map(value => {
					if(value.children) {
						let md = value.md || 12;
						return (
							<Grid item md={md}>
								<FormatFields fields={value.children} mode={mode} data={data}> category={category}</FormatFields>
							</Grid>
						)
					} else {
						switch (value.type) {
							case 'hr':
								return <Divider sx={{margin:"10px"}}/>
							default:
								if (value.visible !== false || mode === "write") {
									let md = value.md || 12;
									return (
										<Grid item md={md}>

											<FormatField field={value}
														 data={data}
														 key={value.key}
														 mode={mode}
														 category={category}/>
										</Grid>)
								}
								break;
						}


					}
				}
			)}
		</>);
	}
	return null;
}

const FormatField = ({field, data, mode,category}) => {

	let dataActual = getData(data, field.key, field.dataFunction);

	if (mode === 'read' && (dataActual === undefined || dataActual === "" || dataActual === null)) {
		return (<></>);
	}

	const dataReadItems = {
		'title': {"element": DataItemTitle},
		'description': {"element": DataItemDescription},
		'p': {"element": DataItemP},
		'grid': {"element": DataItemGrid},
		'h2': {"element": DataItemH2},
		'md': {"element": dataItemMarkdown},
		'images': {"element": dataItemImages},
		'twitter': {"element": DataItemSocialTwitter},
		'facebook': {"element": DataItemSocialFacebook},
		'instagram': {"element": DataItemSocialInstagram},
		'social': {"element": DataItemSocialGeneric},
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
			options = {...dataWriteItem['title'].options, ...field.options};
		}
	}

	return (
		<Element id={field.key}
				 name={field.name}
				 required={field.required}
				 data={dataActual}
				 prompt={field.prompt}
				 sx={field.sx}
				 category={category}
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

	if (func) {
		return func(data);
	}

	switch(path) {
		case 'subCategory':
			result=[];
			if(data.properties && data.properties.data) {
				if (data.properties.data.categoryLevel1)
					result.push(data.properties.data.categoryLevel1);
				if (data.properties.data.categoryLevel2)
					result.push(data.properties.data.categoryLevel2);
				if (data.properties.data.categoryLevel3)
					result.push(data.properties.data.categoryLevel3);
			}
			break;
		default:
			try
			{
				result = safeEval(`data.${path}`, data);
			} catch (e) {
				//console.log(e);
				result="";
			}
			break;
	}
	return result;

}

export {FieldView, FormatField};
