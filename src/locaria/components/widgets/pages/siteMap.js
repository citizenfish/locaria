import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {useHistory} from "react-router-dom";

import UrlCoder from "../../../libs/urlCoder"
import {useMediaQuery} from "@mui/material";
import TypographyHeader from "../typography/typographyHeader";
import Carousel from "react-material-ui-carousel";
import Paper from "@mui/material/Paper";
import ClickAway from "../utils/clickAway";
import {useSelector} from "react-redux";

const SiteMap = function ({mode, images, feature, format}) {

	let useImages = images || [];
	const report = useSelector((state) => state.viewDraw.report);

	if (feature === true && report && report.viewLoader) {
		useImages = [];
		for (let i in report.viewLoader.packet.features[0].properties.data.images)
			useImages.push({"url": report.viewLoader.packet.features[0].properties.data.images[i]})
	}

	const mobile = useSelector((state) => state.mediaSlice.mobile);


	if (mode === 'full') {
		return (
			<Box sx={{
				background: window.systemMain.themePanels,
				flexGrow: 1,
				textAlign: 'center',
				height: !mobile ? "500px" : "370px",
				backgroundSize: "cover",
				backgroundPositionY: "50%"
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
						left: "-15px"
					}}>
						{!mobile ? <Panels></Panels> : <></>}
					</Box>
				</Box>
				<Carousel height={!mobile ? "450px" : "320px"}>
					{
						useImages.map((item, i) => <Item key={i} item={item} format={format}/>)
					}
				</Carousel>

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

function Item({item, format}) {
	const url = new UrlCoder();

	let sx={
		backgroundImage: `url(${url.decode(item.url, true)})`,
		height: "100%",
		backgroundSize: "cover"
	}

	if(format==='contain') {
		sx.backgroundSize="contain";
		sx.backgroundRepeat="no-repeat";
		sx.backgroundPositionX="center";
		sx.backgroundPositionY="center";
	}

	return (
		<Paper sx={sx}/>
	)
}

const Panels = () => {
	const history = useHistory();
	const url = new UrlCoder();
	const [collapseOpen, setCollapseOpen] = useState({});
	const [render, forceRender] = useState(0);

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
	for (let p in window.siteMap) {
		let panelItems = [];
		for (let i in window.siteMap[p].items) {
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
		panelArray.push(
			<Grid item md={2} key={window.siteMap[p].key}>
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