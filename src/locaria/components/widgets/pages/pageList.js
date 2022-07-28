import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {useHistory} from "react-router-dom";
import UrlCoder from "../../../libs/urlCoder";
import TypographyHeader from "../typography/typographyHeader";
import {useSelector} from "react-redux";

const PageList = function () {
	const history = useHistory();
	const url = new UrlCoder();
	const mobile = useSelector((state) => state.mediaSlice.mobile);

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
						<TypographyHeader sx={{color: window.siteMap[p].backgroundColor,fontSize:!mobile? "0.9rem":"0.6rem"}}
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
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
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