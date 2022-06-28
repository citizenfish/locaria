import React from "react";
import Grid from "@mui/material/Grid";
import BasicImage from "../images/basicImage";


export default function SocialIcons() {

	//let gridMax = parseInt(12 / window.systemMain.socialMedia.length);

	return (
		<Grid container spacing={2}>
			{window.systemMain.socialMedia.map((social) => {
				return (
					<Grid item md={1} key={social.title} onClick={(e) => {
						window.location = social.url;
					}} sx={{marginRight: "10px"}}>
						<BasicImage src={social.src} sx={{width: "50px", height: "50px"}}/>
					</Grid>
				)
			})}
		</Grid>
	)
}