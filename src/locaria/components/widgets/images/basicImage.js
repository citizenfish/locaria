import React from 'react';
import UrlCoder from "../../../libs/urlCoder"
import Box from "@mui/material/Box";


export default function BasicImage ({src, sx})  {

	const url = new UrlCoder();
	const decodedUrl=url.decode(src, true);

	let  actualSx= {
		...{
			backgroundImage: `url(${decodedUrl})`,
			width: "100%"
		}, ...sx? sx:{}
	};

	return (
		<Box sx={actualSx}>

		</Box>
	)

}