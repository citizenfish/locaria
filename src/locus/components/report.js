import React from 'react';
import {Link, useParams} from 'react-router-dom';
import Grid from "@material-ui/core/Grid";
import ChannelCard from './widgets/channelCard';
import Paper from "@material-ui/core/Paper";


import Layout from './widgets/layout';
import LinearProgress from "@material-ui/core/LinearProgress";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import {useStyles} from "themeLocus";
import {useCookies} from "react-cookie";

const Report = () => {
	const classes = useStyles();

	let {reportId} = useParams();
	const [report, setReport] = React.useState(null);
	const [location, setLocation] = useCookies(['location']);

	React.useEffect(() => {

		window.websocket.registerQueue("historyReportRender", function (json) {
			setReport(json);
		});

		forceUpdate();

	}, []);

	const forceUpdate = () => {
		setReport(null);
		window.websocket.send({
			"queue": "historyReportRender",
			"api": "api",
			"data": {
				"method": "report",
				"report_name": reportId,
				"location": `SRID=4326;POINT(${location.location[0]} ${location.location[1]})`
			}
		});
	}

	const showReport = () => {

		if (report.packet.features.length > 0) {
			return (report.packet.features
					.map(feature => (
						<Card variant="outlined" className={classes.categoryResultsCard}>
							<CardHeader
								avatar={
									<Avatar aria-label="recipe" className={classes.avatar}>
										{feature.properties.description.type[0]}
									</Avatar>
								}
								title={feature.properties.title}
								subheader={'Distance: ' + distance.distanceFormatNice(feature.properties.distance, location.distanceSelect)}
							/>
							<CardActionArea>
								<CardContent>
									<Typography gutterBottom variant="h5" component="h2">
										{feature.properties.title}
									</Typography>
									<Typography variant="body2" color="textSecondary" component="p">
										{feature.properties.description.text}
									</Typography>
								</CardContent>
							</CardActionArea>
						</Card>
					))
			)
		} else {
			return (
				<Card className={classes.channelCardForm}>
					<CardContent>
						<Typography variant="h2" component="h2" gutterBottom>
							No results found
						</Typography>
						<p>Try adjusting your location}</p>
					</CardContent>
				</Card>
			)
		}
	}


	if (report !== null) {
		return (
			<Layout update={forceUpdate}>
				<Grid container className={classes.root} spacing={6}>
					<Grid item md={4}>
						<Paper elevation={3} className={classes.paperMargin}>
							<ChannelCard path={'/'}></ChannelCard>
						</Paper>
					</Grid>
					<Grid item md={8}>
						<Paper elevation={3} className={classes.paperMargin}>

							{showReport()}

						</Paper>
					</Grid>
				</Grid>
			</Layout>
		);
	} else {
		return (
			<Layout>
				<LinearProgress/>
			</Layout>
		)
	}

};


export default Report;