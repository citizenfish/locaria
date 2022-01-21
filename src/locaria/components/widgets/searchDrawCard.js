import React from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CardImageLoader from "./cardImageLoader";
import {channels,configs} from "themeLocaria";
import {useStyles} from "stylesLocaria";
import {useHistory} from "react-router-dom";
import {Divider} from "@mui/material";

const SearchDrawCard = function({properties}) {
	const classes = useStyles();
	const history = useHistory();

	switch(properties.featureType) {
		case 'location':
			return (
				<Paper elevation={0} disableElevation className={classes.SearchDrawWrapper}>
					<CardImageLoader defaultImage={configs.defaultImage}/>
					<div className={classes.SearchDrawContent}>
						<Typography className={classes.SearchDrawNameText}
						            variant="h5">{properties.address}</Typography>
						<Divider/>

						<Typography className={classes.SearchDrawShipText}
						            variant="h5">{properties['local_type']}</Typography>
						<Button disableElevation variant="contained" className={classes.SearchDrawButton} onClick={() => {
							let channel = channels.getChannelProperties(properties.category);
							history.push(`/${channel.type}/${properties.category}/${channel.reportId}/${properties.fid}`)
						}}>View</Button>
					</div>
				</Paper>
			)
		default:
			return (
				<Paper elevation={0} disableElevation className={classes.SearchDrawWrapper}>
					<CardImageLoader defaultImage={configs.defaultImage}
					                 images={properties.description? properties.description.images:''}/>
					<div className={classes.SearchDrawContent}>
						<Typography className={classes.SearchDrawNameText}
						            variant="h5">{properties.description.title}</Typography>
						<Divider/>

						<Typography className={classes.SearchDrawShipText}
						            variant="h5">{properties.description.text}</Typography>
						<Button disableElevation variant="contained" className={classes.SearchDrawButton} onClick={() => {
							let channel = channels.getChannelProperties(properties.category);
							history.push(`/${channel.type}/${properties.category}/${channel.reportId}/${properties.fid}`)
						}}>View</Button>
					</div>
				</Paper>
			)
	}

};

export default SearchDrawCard;
