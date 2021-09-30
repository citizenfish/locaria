import React from 'react';
import {Link, useParams} from 'react-router-dom';

import Layout from './Layout';
import ChannelCard from './channelCard';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {channels, useStyles} from "themeLocus";
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

import Distance from "libs/Distance";

import SearchDistance from "./search/SearchDistance";
import SearchRange from "./search/SearchRange";
import SearchTags from "./search/SearchTags";

const Category = () => {

	const classes = useStyles();
	const distance = new Distance();

	let {category,searchLocation,searchDistance} = useParams();

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

	function handleFilterChange(e,newValue) {
		const distance=newValue;
		setLocation('distance',distance , {path: '/', sameSite: true});
		location.distance = distance;
		setReport(null);
	}

	function handleTagChange(newTags) {
		setTags(newTags);
		setReport(null);
	}

	function handleRangeChange(e,newValue) {

		setLocation('rangeFrom',newValue[0] , {path: '/', sameSite: true});
		setLocation('rangeTo',newValue[1] , {path: '/', sameSite: true});

		setReport(null);
	}

	const forceUpdate = () => {
		let actualDistance=distance.distanceActual(location.distance, location.distanceSelect);
		let actualLocation=location.location;
		if(searchLocation!==undefined) {
			actualLocation = searchLocation.split(",");
			actualDistance=searchDistance||1;
		}
		let packet={
			"queue": "categoryLoader",
			"api": "api",
			"data": {
				"method": "search",
				"category": channel.category,
				"limit": 100,
				"location": `SRID=4326;POINT(${actualLocation[0]} ${actualLocation[1]})`,
				"location_distance": actualDistance
			}
		};
		if(channel.filterTags)
			packet.data.tags=channel.filterTags;
		// Tags filter override?
		if(tags.length>0&&channel.search!==undefined&&channels.getChannelSearchItem(category,'SearchTags')!==false)
			packet.data.tags=tags;
		if(location.rangeFrom&&channel.search!==undefined&&channels.getChannelSearchItem(category,'SearchRange')!==false) {
			packet.data.min_range = location.rangeFrom;
			packet.data.max_range = location.rangeTo;
		}
		window.websocket.send(packet);
	}

	if (currentCategory !== category) {
		setCurrentCategory(category);
		forceUpdate();
	}

	const showHeader = (feature) => {
		if(feature.properties.tags&&feature.properties.tags.length>0) {
			return (<CardHeader
				avatar={
					<Avatar aria-label={feature.properties.tags[0]}
					        style={{"background-color": `${channels.getChannelColor(category, feature.properties.tags[0])}`}}>
						{feature.properties.tags[0][0].toUpperCase()}
					</Avatar>
				}
				title={feature.properties.description.title}
				subheader={'Distance: ' + distance.distanceFormatNice(feature.properties.distance, location.distanceSelect)}
			>
			</CardHeader>)
		} return '';
	}

	const showReport = () => {

		if(report.packet.features.length>0) {
			return (report.packet.features
					.map(feature => (
						<Card variant="outlined" className={classes.categoryResultsCard}>
							{showHeader(feature)}
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
									<Button size="small" color="secondary" variant="outlined">
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
						<Typography variant="h4" component="h4" gutterBottom>
							No results found
						</Typography>
						<p>Try adjusting the distance filters as your are currently limiting your results to {location.distance} {distance.distanceLang(location.distanceSelect)}</p>
					</CardContent>
				</Card>
			)
		}
	}

	const showSearch = () => {
		if(channel.search===undefined)
			return (
				<SearchDistance changeFunction={handleFilterChange}
				                currentValue={location.distance}></SearchDistance>
			)
		return (
			channel.search.map(function(item) {
				if (item.component === 'SearchDistance') {
					return (<SearchDistance changeFunction={handleFilterChange} min={item.min} max={item.max}
					                        currentValue={location.distance}></SearchDistance>)
				}
				if (item.component === 'SearchRange') {
					return (<SearchRange changeFunction={handleRangeChange} title={item.title} min={item.min} max={item.max}
					                     currentValueFrom={location.rangeFrom||item.min} currentValueTo={location.rangeTo||item.max}></SearchRange>)
				}
				if (item.component === 'SearchTags') {
					return (<SearchTags category={category} changeFunction={handleTagChange}
					                   currentValue={tags}></SearchTags>)
				}
			})
		)

	}

	if (report !== null) {
		return (
			<Layout update={handleLocationChange}>
				<Grid container className={classes.root} spacing={6}>
					<Grid item md={4} className={classes.gridFull}>
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