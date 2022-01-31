import React from 'react';
import {channels} from 'theme/locaria';
import Typography from "@mui/material/Typography";
import {useStyles} from 'theme/styles';
import Grid from "@mui/material/Grid";
import {Container, ToggleButton, ToggleButtonGroup} from "@mui/material";
import ViewListIcon from '@mui/icons-material/ViewList';


const FieldView = ({data}) => {
	const classes = useStyles();

	let channel = channels.getChannelProperties(data.category);

	let fields = channel.fields;

	const [extra, setExtra] = React.useState(false);


	const handleExtra = (event, newExtra => {
			setExtra(newExtra);
		}
	)

	return (
		<Container>
			<Grid container spacing={2} className={classes.ReportMainInfo}>
				<FormatField field={fields.title} data={data}></FormatField>
				<FormatFields fields={fields.main} data={data}></FormatFields>
			</Grid>
			<Grid container spacing={2} className={classes.ReportMainInfoExtra}>
				<FormatFields fields={fields.extra} data={data} extra={true}></FormatFields>
				<ToggleButtonGroup
					value={extra}
					exclusive
					onChange={handleExtra}
					aria-label="text alignment"
				>
					<ToggleButton value="list" aria-label="list">
						<ViewListIcon/>
					</ToggleButton>
				</ToggleButtonGroup>
			</Grid>
		</Container>
	)

}

const FormatFields = ({fields, data, extra = false}) => {
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
	switch (field.display) {
		case 'h3':
			return (
				<Grid item md={12}>
					<Typography variant={"h3"}
					            className={classes.ReportProfileTitle}>{getData(data, field.key)}</Typography>
				</Grid>
			)
		case 'p':
			return (
				<Grid item md={12}>
					<Typography variant={"p"}
					            className={classes.ReportProfileText}>{getData(data, field.key)}</Typography>
				</Grid>
			)
		case 'div':
			return (
				<Grid item md={6}>
					<Typography variant={'h5'} className={classes.ReportInfoTitle}>{field.name}</Typography>
					<Typography variant={'subtitle'}
					            className={classes.ReportInfoText}>{getData(data, field.key)}</Typography>
				</Grid>
			)
		default:
			return (
				<Typography variant={"p"} className={classes.ReportProfileText}>{getData(data, field.key)}</Typography>
			)

	}
}

const getData = (data, path) => {
	let result = eval('data.' + path);
	return result;
}

export {FieldView, FormatField};
//className={classes.ReportProfileTitle}>{() =>{return eval(`data.${field.key}`)}}</Typography>
