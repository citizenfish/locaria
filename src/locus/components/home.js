import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { Link } from 'react-router-dom';
import { channels ,useStyles} from "../../theme/locus";
import Define from '@nautoguide/ourthings-react/Define';

const DEFINE = new Define();

import Layout from './Layout';

const Home = () => {
	const classes = useStyles();

	React.useEffect(() => {
		window.queue.commandsQueue([
				{
					options: {
						queueRun: DEFINE.COMMAND_INSTANT
					},
					queueable: "Openlayers",
					command: "addMap",
					json: {"target":"map","projection":"EPSG:3857","renderer":["canvas"],"zoom":10,center:[-447255.32888684,7332420.40741905]},
					commands: [
						{
							queueable: "Openlayers",
							command: "addLayer",
							json: {"name":"xyz","type":"xyz","url":"https://api.os.uk/maps/raster/v1/zxy/Light_3857/{z}/{x}/{y}.png?key=w69znUGxB6IW5FXkFMH5LQovdZxZP7jv","active":true}
						}
					]
				}

			]
		);
	}, []);


	return (
		<Layout>
			<Paper elevation={3} className={classes.paperMargin}>
				<div id="map" className={classes.map}></div>
			</Paper>
			<Paper elevation={3} className={classes.paperMargin}>
				<Grid container className={classes.root} spacing={2}>
						{channels.map(channel => (
							<Grid item xs={3}>

							<Paper className={classes.channelPanel}>
								{channelDisplay(channel)}
							</Paper>
							</Grid>

						))}
				</Grid>
			</Paper>
		</Layout>
	);
};

function channelDisplay(channel) {
	if(channel.type==='Report')
		return (<Link to={`/${channel.type}/${channel.report_name}`} key={channel.key}>{channel.description}</Link>)
	else
		return (<Link to={`/${channel.type}/${channel.category}`} key={channel.key}>{channel.description}</Link>)

}

export default Home;