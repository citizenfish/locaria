import React from 'react';
import Grid from "@mui/material/Grid";

import DataItemTitle from "./dataItemsRead/dataItemTitle";
import DataItemDescription from "./dataItemsRead/dataItemDescription";
import DataItemDescriptionSummary from "./dataItemsRead/dataItemDescriptionSummary"
import DataItemH2 from "./dataItemsRead/dataItemH2";
import dataItemMarkdown from "./dataItemsRead/dataItemMarkdown";
import DataItemTextInput from "./dataItemsWrite/dataItemTextInput";
import dataItemEditMarkdown from "./dataItemsWrite/dataItemEditMarkdown";
import DataItemP from "./dataItemsRead/dataItemP";
import DataItemSelect from "./dataItemsWrite/dataItemSelect";
import DataItemSubCategory from "./dataItemsWrite/dataItemSubCategory";
import DataItemDateInput from "./dataItemsWrite/dataItemDateInput";
import DataItemMap from "./dataItemsWrite/dataItemMap";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
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
import DataItemImage from "./dataItemsRead/dataItemImage";
import DataItemH1 from "./dataItemsRead/dataItemH1";
import DataItemLinkButton from "./dataItemsRead/dataItemLinkButton";
import DataItemDistance from "./dataItemsRead/dataItemDistance";
import DataItemPhoneButton from "./dataItemsRead/dataItemPhoneButton";
import DataItemMinMedMax from "./dataItemsRead/dataItemMinMedMax";
import {v4 as uuidv4} from "uuid";
import {useDispatch, useSelector} from "react-redux";
import {Stack} from "@mui/material";
import {setFormMode} from "components/redux/slices/formSlice";

const FieldView = ({data, mode = 'read', fields = "main", moderation = false}) => {

	if (data && data.properties && data.properties.category) {
		let channel = window.systemCategories.getChannelProperties(data.properties.category);

		let fieldsObj = channel.fields;

		if (fieldsObj) {
			return (
				<Grid container spacing={2}>
					<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"GB"}>
						{fieldsObj[fields] ?
							<FormatFields fields={fieldsObj[fields]}
										  data={data}
										  mode={mode}
										  moderation={moderation}
										  category={data.properties.category}/> : null}
					</LocalizationProvider>
				</Grid>
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

const FormatFields = ({fields, data, mode, category, moderation}) => {
	const dispatch = useDispatch();
	const formPage = useSelector((state) => state.formSlice.formPage);

	if (fields && fields.length > 0) {

		let formattedArray = [];
		// Loop each field item
		for (let f in fields) {
			const uuid = uuidv4();

			// Check for pages and page elements

			if (fields[f].pages&&fields[f].pages[formPage]) {
				dispatch(setFormMode(true));
				let md = fields[f].md || 12;

				formattedArray.push(
					<Grid item md={md} key={uuid}>
						<DataItemTitle title={fields[f].pages[formPage].title}/>
						<FormatFields fields={fields[f].pages[formPage].page} mode={mode} data={data} moderation={moderation}
								  category={category}/>
					</Grid>
				)
				continue;
			}


			// Children = grids

			if (fields[f].children) {
				let md = fields[f].md || 12;
				let sm = fields[f].sm || 12;
				let spacing = fields[f].spacing || 0;
				if (fields[f].container) {
					formattedArray.push(
						<Grid container spacing={spacing} key={uuid} sx={fields[f].sx}>
							<FormatFields fields={fields[f].children} mode={mode} data={data} moderation={moderation}
										  category={category}/>
						</Grid>
					)
				} else {
					formattedArray.push(
						<Grid item md={md} sd={sm} key={uuid} sx={fields[f].sx}>
							<FormatFields fields={fields[f].children} mode={mode} data={data} moderation={moderation}
										  category={category}/>
						</Grid>
					)
				}
				continue;

			}

			// Standard field elements

			switch (fields[f].type) {
				case 'hr':
					formattedArray.push(<Divider sx={{margin: "10px"}} key={uuid}/>);
				default:
					if (fields[f].visible !== false || mode === "write") {
						let md = fields[f].md || 12;
						formattedArray.push(
							<Grid item md={md} key={uuid}>
								<FormatField field={fields[f]}
											 data={data}
											 key={fields[f].key}
											 mode={mode}
											 moderation={moderation}
											 category={category}/>
							</Grid>)
					}
					break;
			}


		}

		return formattedArray;
	}
	return <></>;
}

const FormatField = ({field, data, mode, category, moderation}) => {
	let dataActual = getData(data, field.key, field.dataFunction);
	let dataModeration = [];

	if (moderation === true) {
		for (let i in data.properties['_moderations']) {
			let moditem = getData(data.properties['_moderations'][i], field.key, field.dataFunction);
			if (moditem && moditem !== dataActual) {
				if (dataModeration.length === 0)
					dataModeration.push(dataActual);
				dataModeration.push(moditem);
			}
		}
		if (dataModeration.length > 0)
			dataActual = dataModeration[dataModeration.length - 1];
		//debugger;
	}
	if (mode === 'read' && (dataActual === undefined || dataActual === "" || dataActual === null)) {
		return (<></>);
	}

	const dataReadItems = {
		'title': {"element": DataItemTitle},
		'description': {"element": DataItemDescription},
		'description_summary': {"element": DataItemDescriptionSummary},
		'p': {"element": DataItemP},
		'grid': {"element": DataItemGrid},
		'h1': {"element": DataItemH1},
		'h2': {"element": DataItemH2},
		'md': {"element": dataItemMarkdown},
		'images': {"element": dataItemImages},
		'image': {"element": DataItemImage},
		'twitter': {"element": DataItemSocialTwitter},
		'facebook': {"element": DataItemSocialFacebook},
		'instagram': {"element": DataItemSocialInstagram},
		'social': {"element": DataItemSocialGeneric},
		'linkButton': {"element": DataItemLinkButton},
		'phoneButton': {"element": DataItemPhoneButton},
		'minMedMax': {"element": DataItemMinMedMax},
		'distance': {"element": DataItemDistance},
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
				 dataModeration={dataModeration}
				 allData={field.needsAll ? data : {}}
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

	switch (path) {
		case 'subCategory':
			result = [];
			if (data.properties && data.properties.data) {
				if (data.properties.data.categoryLevel1)
					result.push(data.properties.data.categoryLevel1);
				if (data.properties.data.categoryLevel2)
					result.push(data.properties.data.categoryLevel2);
				if (data.properties.data.categoryLevel3)
					result.push(data.properties.data.categoryLevel3);
			}
			break;
		default:
			try {
				result = safeEval(`data.${path}`, data);
			} catch (e) {
				//console.log(e);
				result = "";
			}
			break;
	}
	return result;

}

export {FieldView, FormatField};
