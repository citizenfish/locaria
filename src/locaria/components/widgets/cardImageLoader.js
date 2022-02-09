import React from 'react';
import CardMedia from "@mui/material/CardMedia";
import {useStyles} from "stylesLocaria";
import SearchDrawCard from "./draws/cards/searchDrawCard";


const CardImageLoader = ({images, defaultImage, defaultTitle = 'Search', className, gallery = false}) => {
	const classes = useStyles();
	let image, title;

	if (images && images[0]) {
		image = images[0].url;
		title = images[0].title;
	} else {
		title = defaultTitle;
		image = defaultImage;
		return (
			<img src={image} alt={title} className={className ? className : classes.SearchDrawImage}/>
		)
	}

	if (gallery) {
		return (
			images.map((item, index) => {
				if (item) {
					image = item.url;
					title = item.title;
				} else {
					title = defaultTitle;
					image = defaultImage;
				}
				return (<img key={index} src={image} alt={title}
				             className={className ? className : classes.SearchDrawImage}/>)
			})
		)
	} else {

		return (
			<img src={image} alt={title} className={className ? className : classes.SearchDrawImage}/>
		)
	}
}

export default CardImageLoader;

