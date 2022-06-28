import React from 'react';

import Carousel from 'react-material-ui-carousel'
import Paper from "@mui/material/Paper";
import UrlCoder from "../../../libs/urlCoder"

export default function SlideShow({images}) {

	return (
		<Carousel sx={{
			margin: "10px"
		}}>
			{
				images.map( (item, i) => <Item key={i} item={item} /> )
			}
		</Carousel>
	)
}

function Item(props)
{
	const url = new UrlCoder();

	return (
		<Paper sx={{backgroundImage: `url(${url.decode(props.item.url,true)})`,height: "40vh",backgroundSize: "cover"}}>
			<h2>{props.item.name}</h2>
			<p>{props.item.description}</p>
		</Paper>
	)
}