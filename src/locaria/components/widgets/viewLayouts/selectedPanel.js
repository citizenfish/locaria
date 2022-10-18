import React from 'react';
import {useSelector} from "react-redux";
import {FieldView} from "../data/fieldView";
import {objectPathExists} from "../../../libs/objectTools";
import Box from "@mui/material/Box";


export default function SelectedPanel({sx,fields}) {
	const feature = useSelector((state) => state.searchDraw.feature);


	let sxActual={...{
		border: "1px solid black",
			margin:"5px"
		},...sx}

	if(feature) {
		return (
			<Box sx={sxActual}>
				<FieldView data={feature} fields={fields}/>
			</Box>
		)
	} else {
		return (
			<Box></Box>
		)
	}
}