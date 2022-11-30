
import React from 'react';
import Box from "@mui/material/Box";
import TypographyHeader from "../typography/typographyHeader";
import TypographyParagraph from "../typography/typographyParagraph";
import UrlCoder from "../../../libs/urlCoder";
import {useHistory} from "react-router-dom";

export default function dataCard({data,sx}) {

	const url = new UrlCoder();
	const history = useHistory();

	let  actualSx= {
		...{
			backgroundColor: channel.color,
			width: "100%",
			cursor: "pointer"
		}, ...sx? sx:{}
	};

	return (
		<Box sx={actualSx} onClick={() => {
			if(data.url) {
				history.push(data.url);
			}
		}}>

			<Box sx={{
				backgroundImage: `url(${url.decode(data.image, true)})`,
				backgroundSize: "cover",
				height: {md: "150px", xs: "250px"},
				width: "100%"
			}} >

			</Box>
			<Box sx={{
				padding: "15px",
				height: "120px"
			}}>
				<TypographyHeader element={"h3"} sx={{color:"white"}}>
					{data.title}
				</TypographyHeader>
				<TypographyParagraph sx={{color:"white"}}>
					{feature.properties.data.dateDisplay}
				</TypographyParagraph>
				<TypographyHeader element={"h3"} sx={{color:"white"}}>
					Read more...
				</TypographyHeader>
			</Box>
		</Box>
	)
}