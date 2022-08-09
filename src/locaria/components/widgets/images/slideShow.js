import React from 'react';

import Carousel from 'react-material-ui-carousel'
import Paper from "@mui/material/Paper";
import UrlCoder from "../../../libs/urlCoder"
import {useMediaQuery} from "@mui/material";

export default function SlideShow({images,format,orientation="portrait"}) {


	const  desktop=useMediaQuery('(min-width:600px)');
	let height=550;
	if(orientation==='landscape') {
		height=desktop?550:300;
	}

	return (
		<Carousel height={height} sx={{
			margin: "10px"
		}}>
			{
				images.map( (item, i) => <Item key={i} item={item} format={format} height={height}/> )
			}
		</Carousel>
	)
}

function Item({item,format,height})
{
	const url = new UrlCoder();
	let sx={backgroundImage: `url(${url.decode(item.url,true)})`,width: "100%",height:`${height}px`,backgroundSize: "cover"};
	if(format==='contain') {
		sx.backgroundSize="contain";
		sx.backgroundRepeat="no-repeat";
		sx.backgroundPositionX="center";
		sx.backgroundPositionY="center";
	}
	return (
		<Paper sx={sx}>
{/*			<h2>{item.name}</h2>
			<p>{item.description}</p>*/}
		</Paper>
	)
}