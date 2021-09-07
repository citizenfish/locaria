import React from 'react';
import {Link, useParams} from 'react-router-dom';

import Layout from './Layout';
import ChannelCard from './channelCard';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {channels, useStyles} from "../../theme/locus";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';

import LinearProgress from '@material-ui/core/LinearProgress';
import {useCookies} from "react-cookie";

import Distance from "../libs/Distance";

const Category = () => {

	const classes = useStyles();
	const distance = new Distance();

	let {category} = useParams();

	const [currentCategory, setCurrentCategory] = React.useState(category);


	const [report, setReport] = React.useState(null);
	const [location, setLocation] = useCookies(['location']);

	let channel;
	for (let c in channels) {
		if (channels[c].key === category)
			channel = channels[c];
	}

	React.useEffect(() => {

		window.websocket.registerQueue("categoryLoader", function (json) {
			setReport(json);
		});

		forceUpdate();


	}, []);

	function handleChange(e) {
		setLocation('distanceSelect', e.target.value, {path: '/', sameSite: true});

	}

	function handleFilterChange(e) {
		setLocation('range', e.target.value, {path: '/', sameSite: true});
		location.range = e.target.value;
		console.log(location.range);
		forceUpdate();
	}

	const forceUpdate = () => {
		setReport(null);
		window.websocket.send({
			"queue": "categoryLoader",
			"api": "api",
			"data": {
				"method": "search",
				"category": category,
				"limit": 100,
				"location": `SRID=4326;POINT(${location.location[0]} ${location.location[1]})`,
				"location_distance": distance.distanceActual(location.range, location.distanceSelect)
			}
		});
	}

	if (currentCategory !== category) {
		setCurrentCategory(category);
		forceUpdate();
	}

	const showReport = () => {

		if(report.packet.features.length>0) {
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
							<CardActions>
								<Link to={`/View/${category}/${feature.properties.fid}`}>
									<Button size="small" color="primary">
										View
									</Button>
								</Link>
							</CardActions>
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
						<p>Try adjusting the distance filters as your are currently limiting your results to {location.range} {distance.distanceLang(location.distanceSelect)}</p>
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

							<Card className={classes.channelCardForm}>
								<CardContent>
									<FormControl className={classes.formControl} fullWidth>
										<InputLabel id="distance-select-label">Distance</InputLabel>
										<NativeSelect
											labelId="distance-select-label"
											id="distance-select"
											value={location.distanceSelect}
											onChange={handleChange}
										>
											<option value="mile">Miles</option>
											<option value="km">Kilometers</option>
										</NativeSelect>
									</FormControl>
									<FormControl className={classes.formControl} fullWidth>

										<InputLabel id="filter-range-select-label">Range</InputLabel>
										<NativeSelect
											labelId="filter-range-select-label"
											id="range-select"
											value={location.range}
											onChange={handleFilterChange}
										>
											<option value="1">1</option>
											<option value="3">3</option>
											<option value="5">5</option>
											<option value="10">10</option>
											<option value="1000000000000">All</option>
										</NativeSelect>
									</FormControl>
								</CardContent>
							</Card>
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

export default Category;