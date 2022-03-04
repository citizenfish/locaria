import React, {useRef} from 'react';

import { configs} from 'themeLocaria';
import {useStyles} from "stylesLocaria";
import ChannelSelect from "./widgets/channelSelect";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {Box} from "@mui/material";
import Map from "./widgets/map";
import Grid from "@mui/material/Grid";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import {useHistory} from "react-router-dom";




const Landing = () => {
	const classes = useStyles();
	const mapRef = useRef();

	const history = useHistory();

	function handleKeyDown(e) {
		if (e.key === 'Enter') {
			doSearch();
		}
	}

	function doSearch() {
		let newSearchValue = document.getElementById('mySearch').value;
		history.push(`/Search/[]/${newSearchValue}`);
	}

	return (
			<>
				<AppBar position={'static'} justifyContent="center">
					<Toolbar>
						<Typography variant="h6" component="div">
							{configs.siteTitle}
						</Typography>
					</Toolbar>
				</AppBar>
				<Box className={classes.landingCallToAction}
				     display="flex"
				     flexDirection="column"
				     justifyContent="center"
				     alignItems="center">
					<Typography variant="h6" component="div">
						{configs.siteCallToAction}
					</Typography>
				</Box>
				<Grid container className={classes.landingLocation} spacing={1} justifyContent="center">
					<Grid item md={6} className={classes.landingLocationGrid}>
						<div className={classes.landingLocationPod}>
							<Map ref={mapRef} speedDial={false}/>
						</div>
					</Grid>
					<Grid item md={6} className={classes.landingLocationGrid}>
						<div className={classes.landingLocationPod}>
							<InputBase
								className={classes.searchDrawBox}
								id="mySearch"
								placeholder={configs.searchPlaceholder}
								variant="filled"
								onKeyDown={handleKeyDown}
							/>
							<IconButton onClick={() => {
								doSearch('new')
							}} type="submit" aria-label="search">
								<SearchIcon className={classes.icons}  />
							</IconButton>
						</div>

					</Grid>
				</Grid>
				<ChannelSelect></ChannelSelect>
			</>
		)
};


export default Landing;