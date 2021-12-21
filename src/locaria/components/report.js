import React from 'react';
import {Link, useParams} from 'react-router-dom';
import Grid from "@material-ui/core/Grid";
import ChannelCard from './widgets/channelCard';
import Paper from "@material-ui/core/Paper";


import Layout from './widgets/layout';
import LinearProgress from "@material-ui/core/LinearProgress";

import {useStyles} from 'themeLocaria';
import {useCookies} from "react-cookie";

import ShowReport from 'defaults/showReport';

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
			<Layout update={forceUpdate}>
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