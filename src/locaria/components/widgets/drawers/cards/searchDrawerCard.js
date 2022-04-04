import React from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AnchorIcon from '@mui/icons-material/Anchor';
import CardImageLoader from "../../cardImageLoader";
import {channels, configs} from "themeLocaria";
import {useStyles} from "stylesLocaria";
import {Divider} from "@mui/material";
import {useDispatch} from 'react-redux'
import {openViewDraw} from "../../../redux/slices/viewDrawerSlice";
import Grid from "@mui/material/Grid";
import {setLocation} from "../../../redux/slices/layoutSlice";
import Tags from "../../tags";
import IconButton from "@mui/material/IconButton";

const SearchDrawerCard = function ({properties, geometry, mapRef, closeWrapper}) {
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

					<Paper elevation={0}  className={classes.SearchDrawerLocationWrapper}>
						<div className={classes.SearchLocationContent}
							 onClick={() => {
								 mapRef.current.centerOnCoordinate(geometry.coordinates, undefined, "EPSG:4326")
							 }}
						>
							<Grid container>
								<Grid item md={8}>
									<Typography variant="subtitle1"><b>{properties.address}</b></Typography>
									<Typography variant="body2">{properties['local_type']}</Typography>
								</Grid>
								<Grid item md={4}>
									<IconButton  size="small"
												 className={classes.SearchDrawButtonLocation}
												 onClick={(e) => {
														e.stopPropagation()
														dispatch(setLocation(geometry.coordinates))
												 }}
									>
										<AnchorIcon/>
									</IconButton>
								</Grid>
							</Grid>
							<Divider sx={{mb:1, color: "primary.darker"}}/>
						</div>
					</Paper>

			)
		default:
			const channel = channels.getChannelProperties(properties.category);
			if (channel === undefined)
				return <></>
			return (
				<Paper elevation={0}  className={classes.SearchDrawerFeatureWrapper}>
					<div className={classes.SearchLocationContent}
						 onClick={() => {
							 mapRef.current.centerOnCoordinate(geometry.coordinates, undefined, "EPSG:4326")
						 }}
					>
						<Grid container>
							<Grid item md={8}>
								<Typography variant="subtitle1"><b>{properties.description.title}</b></Typography>
								<Typography variant="body2">{properties.description.text}</Typography>
							</Grid>
							<Grid item md={4}>
								<Grid container>
									<Grid item md={12}>
										<div   	className={classes.searchFeatureIcon}
												onClick={(e) => {
													e.stopPropagation()
													if (closeWrapper)
														closeWrapper();
													mapRef.current.clearHighlighted("default", "data");
													dispatch(openViewDraw({fid: properties.fid, category: properties.category}))
												}}>
											<CardImageLoader defaultImage={channel.image ? channel.image : configs.defaultImage}
															 images={properties.description ? properties.description.images : ''}

											/>
										</div>
									</Grid>
									<Grid item md={12}>

									</Grid>
								</Grid>

							</Grid>
						</Grid>
						<Divider sx={{mb:1, color: "primary.darker"}}/>
					</div>
				</Paper>

			)

	}

};

export default SearchDrawerCard;
