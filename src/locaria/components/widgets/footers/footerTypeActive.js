import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

const FooterTypeActive = function () {


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

					// Dave to make nice
					<p>THIS IS FOOTER ACTIVE</p>
				</Grid>
			</Grid>
		</Box>
	)
}

export default FooterTypeActive;