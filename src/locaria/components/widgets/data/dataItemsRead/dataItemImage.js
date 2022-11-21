import React from 'react';
import UrlCoder from "../../../../libs/urlCoder";

const DataItemImage = ({name, data, sx,category}) => {

	let channel = window.systemCategories.getChannelProperties(category);

	let imagesActual=data;
	if((!data||data.length===0)&&channel&&channel.image) {
		imagesActual=[channel.image];
	}

	let sxActual = {
		...{
			width: "250px",
			height: "250px",
		}, ...sx
	}

	const url = new UrlCoder();
	if (imagesActual && imagesActual[0]) {
		let urlActual = url.decode(imagesActual[0], true);
		return (
			<img src={urlActual} style={sxActual}></img>
		)
	} else {
		return (<></>)
	}
}

export default DataItemImage;