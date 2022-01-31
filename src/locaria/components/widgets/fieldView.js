import React from 'react';
import {channels} from 'theme/locaria';
import Typography from "@mui/material/Typography";
import {useStyles} from 'theme/styles';
import Grid from "@mui/material/Grid";
import {Accordion, AccordionDetails, AccordionSummary, Container} from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FieldView = ({data}) => {
	const classes = useStyles();

	let channel = channels.getChannelProperties(data.category);

	let fields = channel.fields;

	if(fields) {
	return (
		<Container>
			<Grid container spacing={2} className={classes.ReportMainInfo}>
				{fields.title? <FormatField field={fields.title} data={data}></FormatField>:null}
				{fields.main? <FormatFields fields={fields.main} data={data}></FormatFields>:null}
			</Grid>
			{fields.extra?
				<Grid container spacing={2} className={classes.ReportMainInfo}>
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
				</Grid>:null
			}
		</Container>
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

	let dataActual=getData(data, field.key);

	switch (field.display) {
		case 'h3':
			return (
				<Grid item md={12}>
					<Typography variant={"h3"}
					            className={classes.ReportProfileTitle}>{dataActual}</Typography>
				</Grid>
			)
		case 'p':
			return (
				<Grid item md={12}>
					<Typography variant={"p"}
					            className={classes.ReportProfileText}>{dataActual}</Typography>
				</Grid>
			)
		case 'div':
			return (
				<Grid item md={6}>
					<Typography variant={'h5'} className={classes.ReportInfoTitle}>{field.name}</Typography>
					<Typography variant={'subtitle'}
					            className={classes.ReportInfoText}>{dataActual}</Typography>
				</Grid>
			)
		default:
			return (
				<Typography variant={"p"} className={classes.ReportProfileText}>{dataActual}</Typography>
			)

	}
}

const getData = (data, path) => {
	let result = eval('data.' + path);
	return result;
}

export {FieldView, FormatField};
//className={classes.ReportProfileTitle}>{() =>{return eval(`data.${field.key}`)}}</Typography>
