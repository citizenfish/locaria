import React from 'react';
import Box from "@mui/material/Box";
import UrlCoder from "../../../libs/urlCoder"
import {useHistory} from "react-router-dom";
import TypographyHeader from "../typography/typographyHeader";
import TypographyParagraph from "../typography/typographyParagraph";


const BigCard = ({feature, sx}) => {

	const url = new UrlCoder();
	const history = useHistory();

	let channel = window.systemCategories.getChannelProperties(feature.properties.category);
	let image = channel.image;
	if (feature.properties.data && feature.properties.data.images && feature.properties.data.images[0])
		image = feature.properties.data.images[0];

	let  actualSx= {
		...{
			backgroundColor: channel.color,
			width: "100%",
			cursor: "pointer"
		}, ...sx? sx:{}
	};
	return (
		<Box sx={actualSx} onClick={() => {
			history.push(`/${channel.page || 'View'}/fp/${feature.properties.category}/${feature.properties.fid}`);
		}}>

			<Box sx={{
				backgroundImage: `url(${url.decode(image, true)})`,
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
					{feature.properties.description.title}
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

export default BigCard;


