import React from 'react';

import Carousel from 'react-material-ui-carousel'
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

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
	return (
		<Paper sx={{backgroundImage: `url(${props.item.url})`}}>
			<h2>{props.item.name}</h2>
			<p>{props.item.description}</p>
		</Paper>
	)
}