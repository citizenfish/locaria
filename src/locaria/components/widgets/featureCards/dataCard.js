import React from 'react';
import Box from "@mui/material/Box";
import UrlCoder from "../../../libs/urlCoder"
import {useHistory} from "react-router-dom";
import {FieldView} from "../data/fieldView";


const DataCard = ({feature, sx,field}) => {

	const history = useHistory();

	let channel = window.systemCategories.getChannelProperties(feature.properties.category);


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
				padding: "15px",
				height: "200px",
				border: "1p solid black",
				overflow: "hidden"
			}}>
				<FieldView data={feature} mode={"read"} fields={field}></FieldView>
			</Box>
		</Box>
	)
}

export default DataCard;


