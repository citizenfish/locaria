import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import UrlCoder from "../../../libs/urlCoder"
import {useHistory} from "react-router-dom";


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
			width: "100%"
		}, ...sx? sx:{}
	};
	return (
		<Box sx={actualSx}>

			<Box sx={{
				backgroundImage: `url(${url.decode(image, true)})`,
				backgroundSize: "cover",
				height: {md: "150px", xs: "250px"},
				width: "100%"
			}} onClick={() => {
				history.push(`/${channel.page || 'View'}/fp/${feature.properties.category}/${feature.properties.fid}`);
			}}>

			</Box>
			<Box sx={{
				padding: "5px",
				height: "50px"
			}}>
				<Typography>
					{feature.properties.description.title}
				</Typography>
			</Box>
		</Box>
	)
}

export default BigCard;


