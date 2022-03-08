import React from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CardImageLoader from "../../cardImageLoader";
import {channels, configs} from "themeLocaria";
import {useStyles} from "stylesLocaria";
import {Container, Divider} from "@mui/material";
import {useDispatch} from 'react-redux'
import {openViewDraw} from "../../../redux/slices/viewDrawSlice";
import Grid from "@mui/material/Grid";
import {setLocation} from "../../../redux/slices/layoutSlice";

const SearchDrawCard = function ({properties, geometry, mapRef, closeWrapper}) {
	const classes = useStyles();
	const dispatch = useDispatch()

	const mapOver = (e) => {
		mapRef.current.setHighlighted("default", "data", [e.currentTarget.getAttribute('data-fid')]);
	}

	const mapOut = (e) => {
		mapRef.current.clearHighlighted("default", "data");
	}

	const channel = channels.getChannelProperties(properties.category);

	switch (properties.featureType) {
		case 'location':
			return (
				<Paper elevation={0} className={classes.SearchDrawWrapper}>
					<CardImageLoader defaultImage={configs.locationIcon}/>
					<div className={classes.SearchDrawContent}>
						<Typography className={classes.SearchDrawNameText}
						            variant="h5">{properties.address}</Typography>
						<Divider/>

						<Typography className={classes.SearchDrawShipText}
						            variant="h5">{properties['local_type']}</Typography>


						<Grid container spacing={1} justifyContent="center">
							<Grid item md={6}>
								<Button variant="contained" size="small" className={classes.SearchDrawButtonLocation} onClick={() => {
									mapRef.current.centerOnCoordinate(geometry.coordinates,undefined,"EPSG:4326");
								}}>Locate</Button>
							</Grid>
							<Grid item md={6}>
								<Button variant="contained" size="small" className={classes.SearchDrawButtonLocation} onClick={() => {
									dispatch(setLocation(geometry.coordinates));
								}}>Set Home</Button>
							</Grid>
						</Grid>


					</div>

				</Paper>
			)
		default:
				return (
					<Paper elevation={0} className={classes.SearchDrawWrapper} onMouseOver={mapOver} onMouseOut={mapOut}
					       data-fid={properties.fid}>
						<CardImageLoader defaultImage={channel.image? channel.image:configs.defaultImage}
						                 images={properties.description ? properties.description.images : ''}/>
						<div className={classes.SearchDrawContent}>
							<div className={classes.SearchDrawContentSub}>
								<Typography className={classes.SearchDrawNameText}>{properties.description.title}</Typography>
								<Divider className={classes.SearchDrawDivider}/>
								<Typography className={classes.SearchDrawShipText}>{properties.description.text}</Typography>
							</div>
							<Button color="secondary" disableElevation variant="contained" className={classes.SearchDrawButton} onClick={() => {
								if (closeWrapper)
									closeWrapper();
								mapRef.current.clearHighlighted("default", "data");
								dispatch(openViewDraw(properties.fid));
							}}>View</Button>
						</div>
					</Paper>
				)

	}

};

export default SearchDrawCard;
