import React from 'react';
import CardMedia from "@mui/material/CardMedia";
import {useStyles} from "stylesLocaria";



const CardImageLoader = ({images, defaultImage, defaultTitle = 'Search'}) => {
	const classes = useStyles();
	let image, title;
	if (images && images[0]) {
		image = images[0].url;
		title = images[0].title;
	} else {
		title = defaultTitle;
		image = defaultImage;
	}


	return (
		<img src={image} alt={title} className={classes.SearchDrawImage} />
	)
}

export default CardImageLoader;

