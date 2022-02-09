import React from 'react';
import {channels} from 'theme/locaria';
import Typography from "@mui/material/Typography";
import {useStyles} from 'theme/styles';
import Grid from "@mui/material/Grid";
import {Accordion, AccordionDetails, AccordionSummary, Container} from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Linker from "./linker";

const FieldView = ({data}) => {
	const classes = useStyles();

	let channel = channels.getChannelProperties(data.category);

	let fields = channel.fields;

	if (fields) {
		return (
			<div>
				{fields.title ? <FormatField field={fields.title} data={data}></FormatField> : null}
				{fields.main ? <FormatFields fields={fields.main} data={data}></FormatFields> : null}
				{fields.extra ?
					<Accordion className={classes.ReportMainInfoAccordion}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon/>}
							aria-controls="panel1a-content"
							id="panel1a-header"
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

const FormatFields = ({fields, data}) => {
	const classes = useStyles();

	if (fields && fields.length > 0) {
		return (<Grid container spacing={2} className={classes.ReportMainInfoExtra}>
			{fields.map(value => (
				<FormatField field={value} data={data}></FormatField>
			))}
		</Grid>);
	}
	return null;

}

const FormatField = ({field, data}) => {
	const classes = useStyles();

	let dataActual = getData(data, field.key, field.dataFunction);


	if (dataActual === undefined || dataActual === "" || dataActual === null) {
		return null;
	}

	switch (field.display) {
		case 'title':
			return (
					<Typography className={classes.ReportProfileTitle}>{dataActual}</Typography>
			)
		case 'p':
			return (
				<Typography className={classes.ReportProfileText}>{dataActual}</Typography>
			)
		case 'div':
			if (field.icon) {
				return (
					<Container>
						<Grid container spacing={2}>
							<Grid item md={2}>
								<img src={field.icon}/>
							</Grid>
							<Grid item md={10}>
								<Typography className={classes.ReportInfoTitle}>{field.name}</Typography>
								<Typography className={classes.ReportInfoText}>{dataActual}</Typography>
							</Grid>
						</Grid>
					</Container>
				)

			} else {
				return (
					<div style={{width: '100%', marginTop: 10}}>
						<Typography className={classes.ReportInfoTitle}>{field.name}</Typography>
						<Typography className={classes.ReportInfoText}>{dataActual}</Typography>
					</div>
				)

			}

		case 'linker':
			return (
					<Linker location={dataActual}>{field.name}</Linker>
			)
		case 'function':
			return dataActual;
		default:
			return (
				<Typography variant={"p"} className={classes.ReportProfileText}>{dataActual}</Typography>
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
//className={classes.ReportProfileTitle}>{() =>{return eval(`data.${field.key}`)}}</Typography>
