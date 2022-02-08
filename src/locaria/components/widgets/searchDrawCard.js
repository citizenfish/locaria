import React from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CardImageLoader from "./cardImageLoader";
import {channels, configs} from "themeLocaria";
import {useStyles} from "stylesLocaria";
import {useHistory} from "react-router-dom";
import {Container, Divider} from "@mui/material";

const SearchDrawCard = function ({properties, geometry, viewWrapper, mapRef, closeWrapper, full = true}) {
	const classes = useStyles();
	const history = useHistory();

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
					<CardImageLoader defaultImage={configs.defaultImage}/>
					<div className={classes.SearchDrawContent}>
						<Typography className={classes.SearchDrawNameText}
						            variant="h5">{properties.address}</Typography>
						<Divider/>

						<Typography className={classes.SearchDrawShipText}
						            variant="h5">{properties['local_type']}</Typography>
						<Button variant="contained" className={classes.SearchDrawButton} onClick={() => {
							let channel = channels.getChannelProperties(properties.category);
							viewWrapper(properties.fid);
						}}>View</Button>
					</div>
				</Paper>
			)
		default:
			if (full) {
				return (
					<Paper elevation={0} className={classes.SearchDrawWrapper} onMouseOver={mapOver} onMouseOut={mapOut}
					       data-fid={properties.fid}>
						<CardImageLoader defaultImage={configs.defaultImage}
						                 images={properties.description ? properties.description.images : ''}/>
						<div className={classes.SearchDrawContent}>
							<div className={classes.SearchDrawContentSub}>
								<Typography className={classes.SearchDrawNameText}>{properties.description.title}</Typography>
								<Divider className={classes.SearchDrawDivider}/>
								<Typography className={classes.SearchDrawShipText}>{properties.description.text}</Typography>
							</div>
							<Button variant="contained" className={classes.SearchDrawButton} onClick={() => {
								if (closeWrapper)
									closeWrapper();
								let channel = channels.getChannelProperties(properties.category);
								mapRef.current.clearHighlighted("default", "data");
								viewWrapper(properties.fid);
								history.push(`/View/${properties.category}/${properties.fid}`)
							}}>View</Button>
						</div>
					</Paper>
				)
			} else {
				return (
					<Button variant="contained" className={classes.SearchDrawButton} onClick={() => {
						if (closeWrapper)
							closeWrapper();
						let channel = channels.getChannelProperties(properties.category);
						mapRef.current.clearHighlighted("default", "data");
						viewWrapper(properties.fid);
						history.push(`/View/${properties.category}/${properties.fid}`)
					}}>View</Button>
				)
			}
	}

};

export default SearchDrawCard;
