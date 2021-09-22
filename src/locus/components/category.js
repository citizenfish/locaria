import React from 'react';
import {Link, useParams} from 'react-router-dom';

import Layout from './Layout';
import ChannelCard from './channelCard';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {channels, useStyles} from "theme_locus";
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
import Chip from '@material-ui/core/Chip';

import LinearProgress from '@material-ui/core/LinearProgress';
import {useCookies} from "react-cookie";

import Distance from "../libs/Distance";

import SearchRange from "./search/SearchRange";
import SearchAge from "./search/SearchAge";
import SearchTags from "./search/SearchTags";

const Category = () => {

	const classes = useStyles();
	const distance = new Distance();

	let {category,searchLocation,searchRange} = useParams();

	const [currentCategory, setCurrentCategory] = React.useState(category);


	const [report, setReport] = React.useState(null);
	const [tags, setTags] = React.useState([]);
	const [location, setLocation] = useCookies(['location']);

	let channel=channels.getChannelProperties(category);


	React.useEffect(() => {

		window.websocket.registerQueue("categoryLoader", function (json) {
			setReport(json);
		});

		if(report===null) {
			forceUpdate();
		}


	});

	function handleLocationChange() {
		setReport(null);

	}

	function handleChange(e) {
		setLocation('distanceSelect', e.target.value, {path: '/', sameSite: true});
	}

	function handleFilterChange(e) {
		const range=document.getElementById('range-select').value;
		setLocation('range',range , {path: '/', sameSite: true});
		location.range = range;
		setReport(null);
	}

	function handleTagChange(newTags) {
		setTags(newTags);
		setReport(null);
	}

	const forceUpdate = () => {
		let actualRange=distance.distanceActual(location.range, location.distanceSelect);
		let actualLocation=location.location;
		if(searchLocation!==undefined) {
			actualLocation = searchLocation.split(",");
			actualRange=searchRange||1;
		}
		let packet={
			"queue": "categoryLoader",
			"api": "api",
			"data": {
				"method": "search",
				"category": channel.category,
				"limit": 100,
				"location": `SRID=4326;POINT(${actualLocation[0]} ${actualLocation[1]})`,
				"location_distance": actualRange
			}
		};
		if(channel.filterTags)
			packet.data.tags=channel.filterTags;
		// Tags filter override?
		if(tags.length>0)
			packet.data.tags=tags;
		window.websocket.send(packet);
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
									<Avatar aria-label={feature.properties.tags[0]} style={{"background-color": `${channels.getChannelColor(category,feature.properties.tags[0])}`}}>
										{feature.properties.tags[0][0].toUpperCase()}
									</Avatar>
								}
								title={feature.properties.description.title}
								subheader={'Distance: ' + distance.distanceFormatNice(feature.properties.distance, location.distanceSelect)}
							>
							</CardHeader>
							<CardActionArea>
								<CardContent>
										{feature.properties.tags.map(tag => (
											<Chip label={tag} variant="outlined" style={{"background-color": `${channels.getChannelColor(category,tag)}`}} className={classes.tags} />
										))}
									<Typography gutterBottom variant="h5" component="h2">
										{feature.properties.description.title}
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

	const showSearch = () => {
		if(channel.search===undefined)
			return (
				<SearchRange changeFunction={handleFilterChange}
				             currentValue={location.range}></SearchRange>
			)
		return (
			channel.search.map(function(component) {
				if (component === 'SearchRange') {
					return (<SearchRange changeFunction={handleFilterChange}
					                    currentValue={location.range}></SearchRange>)
				}
				if (component === 'SearchAge') {
					return (<SearchAge changeFunction={handleFilterChange}
					                     currentValue={location.range}></SearchAge>)
				}
				if (component === 'SearchTags') {
					return (<SearchTags changeFunction={handleTagChange}
					                   currentValue={tags}></SearchTags>)
				}
			})
		)

	}

	if (report !== null) {
		return (
			<Layout update={handleLocationChange}>
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
									{showSearch()}
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