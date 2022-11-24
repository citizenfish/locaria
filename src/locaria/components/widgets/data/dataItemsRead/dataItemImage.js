import React from 'react';
import UrlCoder from "../../../../libs/urlCoder";
import Box from "@mui/material/Box";

const DataItemImage = ({name, data, sx,category}) => {

	let channel = window.systemCategories.getChannelProperties(category);

	let imagesActual=data;
	if((!data||data.length===0)&&channel&&channel.image) {
		imagesActual=[channel.image];
	}
	const url = new UrlCoder();
	let urlActual = url.decode(imagesActual[0], true);

	let sxActual = {
		...{
			alignItems: "center",
			background: `url(${urlActual})`,
			maxWidth: "100%",
			maxHeight: "100%",
			display: "block",
			width: "calc( 100vw - 55px )",
			height: "calc( 20vh ) ",
			backgroundPosition: "center",
			backgroundRepeat: "no-repeat",
			backgroundSize: "cover"
		}, ...sx
	}

	if (imagesActual && imagesActual[0]) {
		return (
			<Box sx={sxActual}/>
		)
	} else {
		return (<></>)
	}
}

export default DataItemImage;