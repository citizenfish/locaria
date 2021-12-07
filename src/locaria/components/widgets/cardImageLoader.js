import React from 'react';
import CardMedia from "@material-ui/core/CardMedia";
import {useStyles, configs} from 'themeLocus';


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
		<CardMedia
			className={classes.media}
			image={image}
			title={title}
		/>
	)
}

export default CardImageLoader;

