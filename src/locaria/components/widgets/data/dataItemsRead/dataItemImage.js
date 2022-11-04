import React from 'react';
import UrlCoder from "../../../../libs/urlCoder";

const DataItemImage = ({name, data, sx}) => {
	let sxActual = {
		...{
			width: "250px",
			height: "250px",
		}, ...sx
	}

	const url = new UrlCoder();
	if (data && data[0]) {
		let urlActual = url.decode(data[0], true);
		return (
			<img src={urlActual} style={sxActual}></img>
		)
	} else {
		return (<></>)
	}
}

export default DataItemImage;