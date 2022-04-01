import React from 'react';
import {channels} from 'theme/locaria';
import Typography from "@mui/material/Typography";
import {useStyles} from '../../../theme/default/adminStyle';
import Grid from "@mui/material/Grid";
import {Accordion, AccordionDetails, AccordionSummary, Container} from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Linker from "./linker";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import {updateEditFeatureData} from "../admin/redux/slices/editFeatureDrawerSlice";
import {useDispatch} from "react-redux";

const FieldEdit = ({data}) => {
	const classes = useStyles();
	const dispatch = useDispatch()


	let channel = channels.getChannelProperties(data.category);

	let fields = channel.fields;


	const FormatFields = ({fields, data}) => {

		if (fields && fields.length > 0) {
			return (<Grid container spacing={2} className={classes.ReportMainInfoExtra}>
				{fields.map(value => (
					<FormatField field={value} data={data} key={value.key}></FormatField>
				))}
			</Grid>);
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
			<div>
				{fields.title ? <FormatField field={fields.title} data={data}></FormatField> : null}
				{fields.main ? <FormatFields fields={fields.main} data={data}></FormatFields> : null}
				{fields.extra ?
					<Accordion elevation={0} className={classes.ReportMainInfoAccordion}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon className={classes.ReportMainInfoAccordionSummary}/>}
							aria-controls="panel1a-content"
							id="panel1a-header"
							className={classes.ReportMainInfoAccordionSummary}
						>
							<Typography>More</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<FormatFields fields={fields.extra} data={data}></FormatFields>
						</AccordionDetails>
					</Accordion>
					: null
				}
			</div>
		)
	} else {
		return (
			<Grid container spacing={2} className={classes.ReportMainInfo}>
				<h1>You have not configured data for category {data.category}</h1>
			</Grid>
		)
	}

}





export {FieldEdit};
//className={classes.ReportProfileTitle}>{() =>{return eval(`data.${field.key}`)}}</Typography>
