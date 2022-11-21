import React from 'react';

import Carousel from 'react-material-ui-carousel'
import Paper from "@mui/material/Paper";
import UrlCoder from "../../../libs/urlCoder"
import {useSelector} from "react-redux";
import Box from "@mui/material/Box";
import {objectPathExists} from "../../../libs/objectTools";

export default function SlideShow({images, format = "contain", feature = false, interval,duration,sx,height="450px"}) {
	let useImages = images || [];
	const report = useSelector((state) => state.viewDraw.report);
	const mobile = useSelector((state) => state.mediaSlice.mobile);


	if (feature === true && objectPathExists(report,'viewLoader.packet.features[0].properties.data.images')) {
		useImages = [];
		for (let i in report.viewLoader.packet.features[0].properties.data.images)
			useImages.push({"url": report.viewLoader.packet.features[0].properties.data.images[i]})
	}
	return (
		<Box id={"GalleryBox"} key={"GalleryBox"} sx={sx}>
			{useImages.length > 1 &&
				<Carousel interval={interval} duration={duration} height={height}>
					{
						useImages.map((item, i) => <Item key={i} item={item} format={format}/>)
					}
				</Carousel>
			}
			{useImages.length === 1 &&
				<Box height={height}>
					<Item key={"single"} item={useImages[0]} format={format}/>
				</Box>
			}
		</Box>
	)
}

function Item({item, format}) {
	const url = new UrlCoder();
	let urlActual=item.url||item;
	if(item.type==="video") {
		return (
			<video width="100%" height="100%" autoPlay="autoplay" muted loop>
				<source src={url.decode(urlActual, true)} type="video/mp4"/>
			</video>
		)
	}
	let sx={
		backgroundImage: `url(${url.decode(urlActual, true)})`,
		height: "100%",
		backgroundSize: "cover",
		boxShadow: "none"
	}

	if(format==='contain') {
		sx.backgroundSize="contain";
		sx.backgroundRepeat="no-repeat";
		sx.backgroundPositionX="center";
		sx.backgroundPositionY="center";
	}

	return (
		<Paper sx={sx}/>
	)
}