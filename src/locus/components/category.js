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
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import LinearProgress from '@material-ui/core/LinearProgress';
import {useCookies} from "react-cookie";

import Distance from "../libs/Distance";

const Category = () => {

	const classes = useStyles();
	const distance= new Distance();

	let {category} = useParams();
	const [report, setReport] = React.useState(null);
	const [location, setLocation] = useCookies(['location']);

	let channel;
	for(let c in channels) {
		if(channels[c].key===category)
			channel=channels[c];
	}

	React.useEffect(() => {

		window.websocket.registerQueue("categoryLoader",function(json) {
			setReport(json);
			console.log(json);
		});

		window.websocket.send({
			"queue": "categoryLoader",
			"api": "api",
			"data": {"method": "search", "category": category,"location":`SRID=4326;POINT(${location.location[0]} ${location.location[1]})`,"location_distance":10000000}
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
										<CardHeader
											avatar={
												<Avatar aria-label="recipe" className={classes.avatar}>
													{feature.properties.description.type[0]}
												</Avatar>
											}
											title={feature.properties.title}
											subheader={'Distance: '+distance.distanceFormatNice(feature.properties.distance,'mile')}
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