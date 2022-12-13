import React from 'react';
import Box from "@mui/material/Box";
import {useHistory} from "react-router-dom";
import {FieldView} from "../data/fieldView";


const DataCard = ({feature, sx, field, clickEnabled=true}) => {

	const history = useHistory();

	let channel = window.systemCategories.getChannelProperties(feature.properties.category);


	let  actualSx= {
		...{
			//TODO move into config
			//backgroundColor: channel.color,
			width: "100%",
			overflow: "hidden",
			padding: "10px",
			backgroundColor:"rgba(218, 210, 210, 0.03)"
		}, ...sx? sx:{}
	};

	//console.log(feature);
	return (
		<Box sx={actualSx} onClick={() => {
			if(clickEnabled===true)
				history.push(`/${channel.page || 'View'}/fp/${feature.properties.category}/${feature.properties.fid}`);
		}}>

				<FieldView data={feature} mode={"read"} fields={field} ></FieldView>
		</Box>
	)
}

export default DataCard;


