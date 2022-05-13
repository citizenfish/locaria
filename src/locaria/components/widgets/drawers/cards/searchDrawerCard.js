import React, {useRef} from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AnchorIcon from '@mui/icons-material/Anchor';
import CardImageLoader from "../../cardImageLoader";
import {configs} from "themeLocaria";
import {useStyles} from "stylesLocaria";
import {Divider} from "@mui/material";
import {useDispatch, useSelector} from 'react-redux'
import {openViewDraw} from "../../../redux/slices/viewDrawerSlice";
import Grid from "@mui/material/Grid";
import {setLocation} from "../../../redux/slices/layoutSlice";
import IconButton from "@mui/material/IconButton";
import Tags from "../../tags"
import Chip from "@mui/material/Chip";
import Distance from "../../../../libs/Distance";

import UrlCoder from "../../../../libs/urlCoder";
const url=new UrlCoder();

const SearchDrawerCard = function ({properties, geometry, mapRef, closeWrapper}) {
	const classes = useStyles();
	const dispatch = useDispatch()
	const distanceLib = new Distance();

	const distanceType = useSelector((state) => state.searchDraw.distanceType);


	const mapOver = (e) => {
		mapRef.current.setHighlighted("default", "data", [e.currentTarget.getAttribute('data-fid')]);
	}

	const mapOut = (e) => {
		mapRef.current.clearHighlighted("default", "data");
	}

	const tagRef = useRef();

	const DistanceDisplay = () => {
		if(properties.distance)
		return (
			<Chip label={`Distance: ${distanceLib.distanceFormatNice(properties.distance,distanceType)}`} size="small" variant="outlined" className={classes.chipLight}></Chip>
		)
		else
			return (<></>)
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
														dispatch(setLocation({location:geometry.coordinates,name:properties.address }))
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
			const channel = window.systemCategories.getChannelProperties(properties.category);
			if (channel === undefined)
				return <></>
			return (
				<Paper elevation={0}  className={classes.SearchDrawerFeatureWrapper}
				   onMouseOver={(e) => { mapOver(e);}}
				   onMouseOut={(e) => { mapOut(e);}}
					   data-fid={properties.fid}
				>
					<div className={classes.SearchLocationContent}
						 onClick={(e) => {
							 mapRef.current.centerOnCoordinate(geometry.coordinates, undefined, "EPSG:4326")
						 }}
					>
						<Grid container>
							<Grid item md={8}>

								<Typography variant="subtitle1" className={classes.searchTitle}><b>{properties.description.title}</b></Typography>
								<Typography variant="body2" className={classes.searchText}>{properties.description.text}</Typography>
								<Tags ref={tagRef}
									  tags={properties.tags}
									  mode={"view"}
									  category={properties.category}
									  className={'tagFeatureCard'}
								/>
							</Grid>
							<Grid item md={4}>
								<Grid container alignContent={"center"}>
									<Grid item md={12} alignContent={"center"}>
										<DistanceDisplay/>
										<div   	className={classes.searchFeatureIcon}
												onClick={(e) => {
													e.stopPropagation()
													if (closeWrapper)
														closeWrapper();
													mapRef.current.clearHighlighted("default", "data");
													dispatch(openViewDraw({fid: properties.fid, category: properties.category}))
												}}>
											<CardImageLoader defaultImage={url.decode(channel.image ? channel.image : window.systemMain.defaultImage,true)}
															 images={url.decode(properties.description ? properties.description.images : '',true)}

											/>
										</div>
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
