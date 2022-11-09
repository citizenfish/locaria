import React from "react";
import Grid from "@mui/material/Grid";
import BasicImage from "../images/basicImage";
import Box from "@mui/material/Box";


export default function SocialIcons() {

	//let gridMax = parseInt(12 / window.systemMain.socialMedia.length);

	return (
		<Grid container spacing={6} sx={{
			pointerEvents:"none"
		}}>
			{window.systemMain.socialMedia.map((social) => {
				return (
					<Grid item xs={1} key={social.title}/* onClick={(e)=>{window.location=social.url;}}*/ sx={{
						marginRight: "10px", cursor: "pointer", pointerEvents:"none"
					}}>
						<BasicImage src={social.src} sx={{width: "50px", height: "50px"}} clickUrl={social.url} openNew={true}/>
					</Grid>
				)
			})}
		</Grid>
	)
}