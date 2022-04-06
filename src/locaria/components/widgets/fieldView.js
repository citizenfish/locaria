import React from 'react';
import {channels} from 'theme/locaria';
import Typography from "@mui/material/Typography";
import {useStyles} from 'theme/styles';
import Grid from "@mui/material/Grid";
import {Accordion, AccordionDetails, AccordionSummary, Container} from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Linker from "./linker";
import Button from "@mui/material/Button";
import Tags from "./tags";

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

const FormatFields = ({fields, data}) => {
	const classes = useStyles();

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
	const classes = useStyles();

	let dataActual = getData(data, field.key, field.dataFunction);


	if (dataActual === undefined || dataActual === "" || dataActual === null) {
		return null;
	}

	switch (field.display) {
		case 'titleFull':
			return (
				<Typography className={classes.ReportProfileTitle}>{field.name}: {dataActual}</Typography>
			)
		case 'title':
			return (
					<Typography className={classes.ReportProfileTitle}>{dataActual}</Typography>
			)
		case 'p':
			return (
				<Typography className={classes.ReportProfileText}>{dataActual}</Typography>
			)
		case 'pLabel':
			return (
				<Grid container md={12} sx={{mt:1, mb:1}}>
					<Grid item md={4}>
						<Typography className={classes.ReportProfilePTitle}>{field.name}:</Typography>
					</Grid>
					<Grid item md = {8}>
						<Typography align={"left"} className={classes.ReportProfilePText}>{dataActual}</Typography>
					</Grid>
				</Grid>

			)
		case 'tags':
			return (
				<Grid container md={12} sx={{mt:1, mb:1}}>
					<Grid item md={4}>
						<Typography className={classes.ReportProfilePTitle}>Tags</Typography>
					</Grid>
					<Grid item md = {8}>
						<Tags
							tags={dataActual}
							mode={"view"}
							category={field.category}
							tagClass={'tagFeatureCard'}
						/>
					</Grid>
				</Grid>
			)
		case 'linkButton':
			return(
				<Grid container sx={{mt:1, mb:1}}>
					<Grid item md={4}>
						<Typography className={classes.ReportProfilePTitle}>{field.name}:</Typography>
					</Grid>
					<Grid item md = {8}>
						<Button
						variant={"outlined"}
						onClick={() => {
							window.open(dataActual, '_blank')
						}}
					>
						{field.buttonName}
					</Button>
					</Grid>
				</Grid>

			)
		case 'div':
			if (field.icon) {
				return (
					<Container className={classes.ReportIconRow}>
						<Grid className={classes.ReportMainInfoGrid} container spacing={2}>
							<Grid item md={2} className={classes.ReportMainInfoGridItem}>
								<img src={field.icon} className={classes.ReportInfoIcon}/>
							</Grid>
							<Grid item md={10} className={classes.ReportMainInfoGridItem}>
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
				<div className={classes.ReportLinkButton}>
					<Linker location={dataActual}>{field.name}</Linker>
				</div>
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
