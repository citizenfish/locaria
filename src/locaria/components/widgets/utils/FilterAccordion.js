import React, {useEffect, useRef, useState} from 'react';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import TypographyHeader from "widgets/typography/typographyHeader";
import {useDispatch, useSelector} from "react-redux";
import {setSavedAttribute} from "components/redux/slices/userSlice";
import {deepOrange, grey} from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";

export default function FilterAccordion({children,title,Icon,id}) {
	const dispatch = useDispatch();

	const toggles = useSelector((state) => state.userSlice.toggles);


	function handleChange() {
		let open={};
		if(toggles[id])
			open[id]={open:!toggles[id].open,active:toggles[id].active};
		else
			open[id]={open:true,active:false};
		dispatch(setSavedAttribute({attribute:"toggles",value:{ ...toggles,...open }}));
	}

	return (
		<Accordion expanded={toggles[id]? toggles[id].open:false} onChange={handleChange}>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon/>}
				aria-controls="panel1a-content"
				id="panel1a-header"
			>
				<Avatar sx={{background:toggles[id]? (toggles[id].active? deepOrange[500] : grey[300]):grey[300]}}><Icon/></Avatar>


				<TypographyHeader sx={{"color": "#1976d2", "fontSize": "0.9rem", padding:"13px"}}
								  element={"h2"}>{title}</TypographyHeader>
			</AccordionSummary>
			<AccordionDetails>
				{children}
			</AccordionDetails>
		</Accordion>
	)
}