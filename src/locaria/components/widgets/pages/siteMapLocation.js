import React from "react";
import Box from "@mui/material/Box";

import SlideShow from "../images/slideShow";
import SearchLocationPopup from "../search/SearchLocationPopup";
import SitePanels from "./sitePanels";
import {useSelector} from "react-redux";

const SiteMapLocation = function ({mode="full", images, feature, format = "cover", duration = 500, interval = 2000,defaultPage,open,panel="small"}) {

	const mobile = useSelector((state) => state.mediaSlice.mobile);

	let height=mobile? "250px":"550px";

	switch (mode) {
		case "full":
			return (
				<Box sx={{
					background: window.systemMain.themePanels,
					flexGrow: 1,
					textAlign: 'center',
					height: height ,
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
					<SearchLocationPopup isOpen={true} defaultPage={defaultPage}  panel={panel}></SearchLocationPopup>
				</Box>
			)
			break;
		case "bottom":
			return (
				<Box sx={{
					background: window.systemMain.themePanels,
					flexGrow: 1,
					textAlign: 'center',
					height: height ,
					backgroundSize: "cover",
					backgroundPositionY: "50%",
					position: "relative"
				}} key={"siteMap"}>
					<SlideShow sx={{marginTop: "10px"}} interval={interval} duration={duration} feature={feature}
							   format={format} images={images} height={height}/>
					<SearchLocationPopup isOpen={true} defaultPage={defaultPage}></SearchLocationPopup>
					<Box sx={{
						width: "100%",
						maxWidth: "1100px",
						marginTop: "20px",
						zIndex: 10,
						paddingLeft: "5px",
						paddingRight: "5px"
					}}>
						<SitePanels open={open} mode={mode} panel={panel}></SitePanels>
					</Box>

				</Box>
			)
			break;
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
				</Box>
			)
			break;

	}

}




export default SiteMapLocation;