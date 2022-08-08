import React from 'react';
import UrlCoder from "../../../libs/urlCoder"
import Box from "@mui/material/Box";


export default function BasicImage ({src, sx,clickUrl})  {

	const url = new UrlCoder();
	const decodedUrl=url.decode(src, true);

	let  actualSx= {
		...{
			backgroundImage: `url(${decodedUrl})`,
			width: "100%",
			pointerEvents: "all"
		}, ...sx? sx:{}
	};

	return (
		<Box sx={actualSx} onClick={(e)=>{
			if(clickUrl)
				window.location=clickUrl;
		}}>

		</Box>
	)

}