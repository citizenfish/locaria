import React from "react";
import Box from "@mui/material/Box";

import SlideShow from "../images/slideShow";
import SearchLocationPopup from "../search/SearchLocationPopup";
import SitePanels from "./sitePanels";
import {useSelector} from "react-redux";
import SearchQuestionsPopup from "widgets/search/searchQuestionsPopup";
import UserSearchProfile from "components/user/userSearchProfile";

const SiteMapLocation = function ({mode="full", images, feature, format = "cover", duration = 500, interval = 2000,defaultPage,open,panel="small",heights=["250px","550px"]}) {

	const mobile = useSelector((state) => state.mediaSlice.mobile);

	let height=mobile? heights[0]:heights[1];

	switch (mode) {
		case "full":
			return (
				<Box sx={{
					background: window.systemMain.themePanels,
					flexGrow: 1,
					textAlign: 'center',
					backgroundSize: "cover",
					backgroundPositionY: "50%",
					position: "relative"
				}} key={"siteMap"}>
					<Box sx={{
						position: "absolute",
						width: "100%",
						maxWidth: "1100px",
						top: "-40px"

					}}>
						<Box sx={{
							position: "relative",
							zIndex: 10,
							paddingLeft: "5px",
							paddingRight: "5px"
						}}>
							<SitePanels open={open} mode={mode}></SitePanels>
						</Box>
					</Box>
					<SlideShow sx={{marginTop: "50px"}} height={height} interval={interval} duration={duration} feature={feature}
							   format={format} images={images}/>
					<SearchLocationPopup  defaultPage={defaultPage}  panel={panel}></SearchLocationPopup>
					<SearchQuestionsPopup/>

				</Box>
			)
		case "bottom":
			return (
				<Box sx={{
					background: window.systemMain.themePanels,
					flexGrow: 1,
					textAlign: 'center',
					backgroundSize: "cover",
					backgroundPositionY: "50%",
					position: "relative",
					display: "block"
				}} key={"siteMap"}>
					<SlideShow sx={{marginTop: "10px"}} interval={interval} duration={duration} feature={feature}
							   format={format} images={images} height={height}/>
					<SearchQuestionsPopup/>

					<SearchLocationPopup  defaultPage={defaultPage}></SearchLocationPopup>

					<UserSearchProfile/>

					<Box sx={{
						width: "100%",
						maxWidth: "1100px",
						marginTop: "20px",
						zIndex: 10,
						paddingLeft: "5px",
						paddingRight: "5px",
						display:"block"
					}}>
						<SitePanels open={open} mode={mode} panel={panel}></SitePanels>
					</Box>

				</Box>
			)
		default:
			return (
				<Box sx={{
					background: window.systemMain.themePanels,
					flexGrow: 1,
					textAlign: 'center',
					backgroundSize: "cover",
					backgroundPositionY: "50%",
					position: "relative",
					width: "100%",
					maxWidth: "1100px",
				}} key={"siteMap"}>
					<SitePanels open={open} mode={mode}  panel={panel}></SitePanels>
					<SearchLocationPopup display={false} defaultPage={defaultPage}  panel={panel}></SearchLocationPopup>
					<SearchQuestionsPopup/>
				</Box>
			)

	}

}




export default SiteMapLocation;