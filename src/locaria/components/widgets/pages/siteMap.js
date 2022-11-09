import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {useHistory} from "react-router-dom";

import UrlCoder from "../../../libs/urlCoder"
import TypographyHeader from "../typography/typographyHeader";

import ClickAway from "../utils/clickAway";
import {useSelector} from "react-redux";
import SlideShow from "../images/slideShow";
import {useCookies} from "react-cookie";

const SiteMap = function ({mode, images, feature, format="cover",duration = 500,interval=2000}) {

	const mobile = useSelector((state) => state.mediaSlice.mobile);

	if (mode === 'full') {
		return (
			<Box sx={{
				background: window.systemMain.themePanels,
				flexGrow: 1,
				textAlign: 'center',
				height: !mobile ? "500px" : "370px",
				backgroundSize: "cover",
				backgroundPositionY: "50%",
				position: "relative"
			}} key={"siteMap"}>
				<Box sx={{
					position: "absolute",
					width: "100%",
					maxWidth: "1100px"
				}}>
					<Box sx={{
						position: "relative",
						//top: "-480px",
						zIndex: 100,
						top: "10px",
						paddingLeft: "5px",
						paddingRight: "5px"
					}}>
						{!mobile ? <Panels></Panels> : <></>}
					</Box>
				</Box>
					<SlideShow interval={interval} duration={duration} feature={feature} format={format} images={images}/>
			</Box>
		)
	}

	return (
		<Box sx={{
			background: window.systemMain.themePanels,
			flexGrow: 1,
			textAlign: 'center'
		}} key={"siteMap"}>
			<Box sx={{}}>

				{!mobile ? <Panels></Panels> : <></>}
			</Box>


		</Box>
	)
}


const Panels = () => {
	const history = useHistory();
	const url = new UrlCoder();
	const [collapseOpen, setCollapseOpen] = useState({});
	const [render, forceRender] = useState(0);
	const [cookies, setCookies] = useCookies();

	useEffect(() => {
		let state = collapseOpen;

		for (let p in window.siteMap) {
			state[p] = false;
		}

		setCollapseOpen(state);


	}, []);

	function toggleCollapseOpen(id) {
		let state = collapseOpen;
		for (let p in window.siteMap) {
			if (p === id)
				state[p] = true;
			else state[p] = false;
		}
		setCollapseOpen(state);
		forceRender(render + 1);
	}

	function collapseAll() {
		let state = collapseOpen;

		for (let p in window.siteMap) {
			state[p] = false;
		}
		setCollapseOpen(state);
		forceRender(render + 1);
	}

	let panelArray = [];
	let md=12/(2 * Math.round(window.siteMap.length/2));
	for (let p in window.siteMap) {
		let panelItems = [];
		for (let i in window.siteMap[p].items) {
			// Does the menu item have a group set? if so check they have it
			if(!window.siteMap[p].items[i].group||cookies.groups.indexOf(window.siteMap[p].items[i].group)!==-1) {
				panelItems.push(
					<Box key={i} onClick={() => {
						collapseAll();
						let route = url.route(window.siteMap[p].items[i].link);
						if (route === true) {
							history.push(window.siteMap[p].items[i].link);
						}
					}} sx={{
						borderTop: `1px solid ${window.siteMap[p].color}`,
						fontSize: "0.8rem",
						'&:hover': {
							opacity: "0.5"
						},
						cursor: "pointer"

					}}>
						<TypographyHeader
							sx={{color: window.siteMap[p].color, fontWeight: 400, padding: "5px", fontSize: "0.8rem"}}
							element={"h3"}>{window.siteMap[p].items[i].name}</TypographyHeader>
					</Box>
				)
			}
		}
		panelArray.push(
			<Grid item md={md} key={window.siteMap[p].key}>
				<Box sx={{
					textAlign: 'center'
				}}>

					<Box sx={{
						backgroundColor: window.siteMap[p].backgroundColor,
						color: window.siteMap[p].color,
						fontSize: "0.8rem",
						border: {
							md: `2px solid ${window.siteMap[p].color}`,
							xs: `1px solid ${window.siteMap[p].color}`
						},
						width: '100%',
						padding: "5px",
						opacity: collapseOpen[p] ? 0.5 : 1,
						cursor: "pointer"


					}} onClick={() => {
						toggleCollapseOpen(p);

						if (!window.siteMap[p].items || window.siteMap[p].items.length === 0) {
							let route = url.route(window.siteMap[p].link);
							if (route === true) {
								history.push(window.siteMap[p].link);
							}
						}
					}}
						 onMouseEnter={() => {
							 toggleCollapseOpen(p);
						 }}
						 onMouseLeave={() => {
							 //collapseAll();
						 }}
					>
						<TypographyHeader sx={{color: window.siteMap[p].color}}
										  element={"h3"}>{window.siteMap[p].name}</TypographyHeader>
					</Box>
					{panelItems.length > 0 &&
						<Box sx={{
							width: '165px',
							border: {
								md: `2px solid ${window.siteMap[p].color}`,
								xs: `1px solid ${window.siteMap[p].color}`
							},
							marginTop: '5px',
							backgroundColor: window.siteMap[p].backgroundColor,
							display: collapseOpen[p] ? 'block' : 'none',
							position: "absolute"
						}}>
							{panelItems}
						</Box>
					}
				</Box>

			</Grid>
		)
	}

	return (
		<ClickAway update={collapseAll}>
			<Grid container spacing={2} sx={{
				flexGrow: 1,
				display: "flex",
				justifyContent: "center"
			}}>
				{panelArray}
			</Grid>
		</ClickAway>);

}

export default SiteMap;