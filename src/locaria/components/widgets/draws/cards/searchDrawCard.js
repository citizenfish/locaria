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
import Tags from "../../tags";

const SearchDrawCard = function ({properties, geometry, mapRef, closeWrapper}) {
	const classes = useStyles();
	const dispatch = useDispatch()

	const mapOver = (e) => {
		mapRef.current.setHighlighted("default", "data", [e.currentTarget.getAttribute('data-fid')]);
	}

	const mapOut = (e) => {
		mapRef.current.clearHighlighted("default", "data");
	}


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
								<Button variant="contained" size="small" className={classes.SearchDrawButtonLocation}
								        onClick={() => {
									        mapRef.current.centerOnCoordinate(geometry.coordinates, undefined, "EPSG:4326");
								        }}>Locate</Button>
							</Grid>
							<Grid item md={6}>
								<Button variant="contained" size="small" className={classes.SearchDrawButtonLocation}
								        onClick={() => {
									        dispatch(setLocation(geometry.coordinates));
								        }}>Set Home</Button>
							</Grid>
						</Grid>


					</div>

				</Paper>
			)
		default:
			const channel = channels.getChannelProperties(properties.category);
			if (channel === undefined)
				return <></>
			return (
				<Paper elevation={0} className={classes.SearchDrawWrapper} onMouseOver={mapOver} onMouseOut={mapOut}
				       data-fid={properties.fid}>
					<Grid container justifyContent="center" spacing={0}>
						<Grid item md={3}>
							<Grid item md={12}>
								<CardImageLoader defaultImage={channel.image ? channel.image : configs.defaultImage}
								                 images={properties.description ? properties.description.images : ''}/>
							</Grid>
							<Grid item md={12} justifyContent="center">
								<Button color="secondary" disableElevation variant="contained"
								        className={classes.SearchDrawButton} onClick={() => {
									if (closeWrapper)
										closeWrapper();
									mapRef.current.clearHighlighted("default", "data");
									dispatch(openViewDraw({fid: properties.fid, category: properties.category}));
								}}>View</Button>

							</Grid>
						</Grid>

						<Grid item md={9}>
							<div className={classes.SearchDrawContent}>
								<div className={classes.SearchDrawContentSub}>
									<Typography
										className={classes.SearchDrawNameText}>{properties.description.title}</Typography>
									<Divider className={classes.SearchDrawDivider}/>
									<Typography
										className={classes.SearchDrawShipText}>{properties.description.text}</Typography>
								</div>
								<Tags tags={properties.tags}></Tags>
							</div>
						</Grid>
					</Grid>
				</Paper>

			)

	}

};

export default SearchDrawCard;
