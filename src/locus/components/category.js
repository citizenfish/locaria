import React from 'react';
import {Link, useParams} from 'react-router-dom';

import Layout from './Layout';
import ChannelCard from './channelCard';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {channels,useStyles} from "../../theme/locus";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import LinearProgress from '@material-ui/core/LinearProgress';

const Category = () => {

	const classes = useStyles();

	let {category} = useParams();
	const [report, setReport] = React.useState(null);

	let channel;
	for(let c in channels) {
		if(channels[c].key===category)
			channel=channels[c];
	}

	React.useEffect(() => {

		window.websocket.registerQueue("categoryLoader",function(json) {
			setReport(json);
		});

		window.websocket.send({
			"queue": "categoryLoader",
			"api": "api",
			"data": {"method": "search", "category": category}
		});



	}, []);

	if (report !== null) {
		return (
			<Layout>
				<Grid container className={classes.root} spacing={6}>
					<Grid item xs={4}>
						<Paper elevation={3} className={classes.paperMargin}>
							<ChannelCard></ChannelCard>
						</Paper>
					</Grid>
					<Grid item xs={8}>
						<Paper elevation={3} className={classes.paperMargin}>

							{report.packet.features
								.map(feature => (
									<Card variant="outlined" className={classes.root}>
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
										<CardActions>
											<Button size="small" color="primary">
												Share
											</Button>
											<Link to={`/View/${category}/${feature.properties.fid}`}>
												<Button size="small" color="primary">
													View
												</Button>
											</Link>
										</CardActions>
									</Card>
								))}

						</Paper>
					</Grid>
				</Grid>
			</Layout>
		);
	} else {
		return (
			<Layout>
				<LinearProgress />
			</Layout>
		)
	}

};

export default Category;