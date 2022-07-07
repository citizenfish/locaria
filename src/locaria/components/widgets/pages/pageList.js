import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {useHistory} from "react-router-dom";
import UrlCoder from "../../../libs/urlCoder";
import TypographyHeader from "../typography/typographyHeader";

const PageList = function () {
	const history = useHistory();
	const url = new UrlCoder();

	const Panels = () => {
		let panelArray = [];
		for (let p in window.siteMap) {
			panelArray.push(
				<Grid item xs={2} key={window.siteMap[p].key}>
					<Box sx={{
						cursor: "pointer"
					}} onClick={() => {
						let route = url.route(window.siteMap[p].link);
						if (route === true) {
							history.push(window.siteMap[p].link);
						}
					}
					}>
						<TypographyHeader sx={{color: window.siteMap[p].backgroundColor}}
										  element={"h3"}>{window.siteMap[p].name}</TypographyHeader>
					</Box>
				</Grid>
			)
		}

		return panelArray;

	}

	return (
		<Box key={"pageList"} sx={{
			flexGrow: 1,
			textAlign: 'center'
		}}>
			<Grid container spacing={2} sx={{
				flexGrow: 1
			}}>
				<Panels></Panels>
			</Grid>
		</Box>
	)

}

export default PageList;