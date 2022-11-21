import React from 'react';
import Box from "@mui/material/Box";
import UrlCoder from "../../../libs/urlCoder"
import {useHistory} from "react-router-dom";
import {FieldView} from "../data/fieldView";


const DataCard = ({feature, sx,field,clickEnabled=true}) => {

	const history = useHistory();

	let channel = window.systemCategories.getChannelProperties(feature.properties.category);


	let  actualSx= {
		...{
			backgroundColor: channel.color,
			width: "100%",
			cursor: "pointer"
		}, ...sx? sx:{}
	};

	//console.log(feature);
	return (
		<Box sx={actualSx} onClick={() => {
			if(clickEnabled===true)
				history.push(`/${channel.page || 'View'}/fp/${feature.properties.category}/${feature.properties.fid}`);
		}}>

			<Box sx={{
				minHeight: "200px",
				border: "1p solid black",
				overflow: "hidden"
			}}>
				<FieldView data={feature} mode={"read"} fields={field} ></FieldView>
			</Box>
		</Box>
	)
}

export default DataCard;


