import React from 'react';
import {useStyles} from '../../../theme/default/adminStyle';

import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import {useDispatch} from "react-redux";

const FieldEdit = ({data}) => {
	const classes = useStyles();
	const dispatch = useDispatch()


	let channel = window.systemCategories.getChannelProperties(data.category);

	let fields = channel.fields;


	const FormatFields = ({fields, data}) => {

		if (fields && fields.length > 0) {
			return (<>
				{fields.map(value => (
					<FormatField field={value} data={data} key={value.key}></FormatField>
				))}
			</>);
		}
		return null;

	}
	const FormatField = ({field, data}) => {

		let dataActual = getData(data, field.key, field.dataFunction);


		if (dataActual === undefined || dataActual === "" || dataActual === null) {
			return null;
		}

		return (
			<FormControl className={classes.formControl} fullWidth>
				<InputLabel id={field.key + '-label'}>{field.name}</InputLabel>
				<Input type="text" labelId={field.key + '-label'} id={field.key + '-id'}
				       defaultValue={dataActual}
				       name={field.key} />
			</FormControl>
		)

	}

	const getData = (data, path, func) => {
		let result;

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




	if (fields) {
		return (
			<>
				{fields.title ? <FormatField field={fields.title} data={data}></FormatField> : null}
				{fields.main ? <FormatFields fields={fields.main} data={data}></FormatFields> : null}
				{fields.extra ? <FormatFields fields={fields.extra} data={data}></FormatFields> : null}
			</>
		)
	} else {
		return (
				<h1>You have not configured data for category {data.category}</h1>
		)
	}

}





export {FieldEdit};
//className={classes.ReportProfileTitle}>{() =>{return eval(`data.${field.key}`)}}</Typography>
