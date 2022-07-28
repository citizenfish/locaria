import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import RenderMarkdown from "../markdown/renderMarkdown";

const FooterTypeSimple = function () {


	return (
		<Box key={"footerTypeSimple"} sx={{
			width: "100%",
			justifyContent: 'space-between',
			backgroundColor: window.systemMain.headerBackground,
			marginTop: "10px"
		}}>
			<Grid container>
				<Grid item xs={12} sx={{
					textAlign: "left",
					padding: "10px"
				}}>
					<RenderMarkdown markdown={window.systemLang.siteFooter}/>
				</Grid>
			</Grid>
		</Box>
	)
}

export default FooterTypeSimple;