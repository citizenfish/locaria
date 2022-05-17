import React from 'react';
import {Link, useParams} from 'react-router-dom';
import Grid from "@mui/material/Grid";
import ChannelCard from './channelCard';
import Paper from "@mui/material/Paper";


import Layout from '../locaria/components/widgets/layout';
import LinearProgress from "@mui/material/LinearProgress";

import {useStyles} from 'stylesLocaria';
import {useCookies} from "react-cookie";

import ShowReport from 'src/locaria/components/widgets/showReport';

const Report = () => {
	const classes = useStyles();

	let {reportId, feature} = useParams();
	const [report, setReport] = React.useState(null);
	const [location, setLocation] = useCookies(['location']);

	React.useEffect(() => {

		window.websocket.registerQueue("bulk1", function (json) {
			setReport(json);
		});

		if (report === null)
			forceUpdate();

		return () => {
			window.websocket.clearQueues();
		}

	}, [report]);

	const forceUpdate = () => {
		setReport(null);
		window.websocket.sendBulk('bulk1',[{
			"queue": "feature",
			"api": "api",
			"data": {"method": "get_item", "fid": feature}
		},
			{
				"queue": "links",
				"api": "api",
				"data": {
					"method": "report",
					"report_name": reportId,
					"location": `SRID=4326;POINT(${location.location[0]} ${location.location[1]})`,
					"fid": feature
				}
			}
		]);
	}


	if (report !== null) {
		return (
			<Layout update={forceUpdate} map={false}>
				<ShowReport reportId={reportId} reportData={report}/>
{/*
				<Grid container className={classes.root} spacing={6}>
					<Grid item md={4}>
						<Paper elevation={3} className={classes.paperMargin}>
							<ChannelCard path={'/'}></ChannelCard>
						</Paper>
					</Grid>
					<Grid item md={8}>
						<Paper elevation={3} className={classes.paperMargin}>
							<ShowReport reportId={reportId} reportData={report}/>
						</Paper>
					</Grid>
				</Grid>
*/}
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