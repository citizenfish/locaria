import React from 'react';

import {channels, useStyles, configs} from 'themeLocus';

import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {useHistory} from "react-router-dom";
import InputBase from "@material-ui/core/InputBase";
import {useCookies} from "react-cookie";
import SearchBanner from "../defaults/searchBanner";

const ChannelSearch = () => {
	const classes = useStyles();
	const history = useHistory();

	const [cookies, setCookies] = useCookies(['location']);
	const [searchResults, setSearchResults] = React.useState(undefined);

	React.useEffect(() => {

		window.websocket.registerQueue("searchLoader", function (json) {
			setSearchResults(json.packet.features);
		});

		return () => {
			window.websocket.clearQueues();
		}


	}, []);

	function handleKeyDown(e) {
		if (e.key === 'Enter') {
			doSearch();

		}

	}

	function doSearch() {
		let packet = {
			"queue": "searchLoader",
			"api": "api",
			"data": {
				"method": "search",
				"category": configs.homeCategorySearch,
				"limit": configs.searchLimit
			}
		};
		window.websocket.send(packet);
	}

	const SearchResults = () => {
		if (searchResults !== undefined) {
			return (
				searchResults.map(function (feature) {
					return (
						<Grid item md={configs.homeGrid} className={classes.searchResults} key={feature.properties.fid}>
							<Card className={classes.root}>
								<CardMedia
									className={classes.media}
									image={configs.searchIcon}
									title={'Search'}
								/>
								<CardContent className={classes.channelPanel}>
									<Typography gutterBottom variant="h5" component="h2">
										{feature.properties.description.title}
									</Typography>
									<Typography variant="body2" color="textSecondary" component="p">
										{feature.properties.description.text}
									</Typography>
								</CardContent>
								<CardActions>
									<Button size="small" color="secondary" variant="outlined" onClick={() => {
										let channel = channels.getChannelProperties(feature.properties.category);
										history.push(`/${channel.type}/${feature.properties.category}/${channel.reportId}/${feature.properties.fid}`)
									}}>
										View
									</Button>
								</CardActions>
							</Card>
						</Grid>
					)
				})
			)
		} else {
			return (
				<Grid item md={12 - configs.homeGrid} className={classes.searchResults}>
					<SearchBanner/>
				</Grid>
			)
		}
	}


	const SearchPanel = () => {
		return (
			<Grid item md={configs.homeGrid} className={classes.channel}>
				<Card className={classes.root}>
					<CardMedia
						className={classes.media}
						image={configs.searchIcon}
						title={'Search'}
					/>
					<CardContent className={classes.channelPanel}>
						<Typography gutterBottom variant="h5" component="h2">
							Search
						</Typography>
						<Typography variant="body2" color="textSecondary" component="p">
							Search our records for your connection
						</Typography>
					</CardContent>
					<CardActions>
						<InputBase
							placeholder="Search…"
							classes={{
								root: classes.inputRoot,
								input: classes.inputInput,
							}}
							inputProps={{'aria-label': 'search'}}
							defaultValue={''}
							onKeyPress={handleKeyDown}
							id="myPostcode"
						/>

						<Button size="small" color="secondary" variant="outlined" onClick={() => {
							doSearch();
						}}>
							Search
						</Button>
					</CardActions>
				</Card>
			</Grid>
		)
	}

	return (
		<Grid container className={classes.root} spacing={2} justifyContent="flex-start">
			<SearchPanel/>
			<SearchResults/>
		</Grid>
	)
}


export default ChannelSearch;