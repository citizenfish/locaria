import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {useHistory} from "react-router-dom";

import UrlCoder from "../../../libs/urlCoder"
import {useMediaQuery} from "@mui/material";
import TypographyHeader from "../typography/typographyHeader";

const SiteMap = function ({mode}) {

	const url = new UrlCoder();

	const sizeMatches = useMediaQuery('(min-width:600px)');


	let sx = {
		background: window.systemMain.themePanels,
		flexGrow: 1,
		textAlign: 'center'
	}

	if (mode === 'full') {
		sx.backgroundImage = `url(${url.decode(window.systemMain.galleryImage, true)})`;
		sx.height = "300px";
		sx.backgroundSize = "cover";
		sx.backgroundPositionY = "50%";
	}

	return (
		<Box sx={sx} key={"siteMap"}>
			<Box sx={{
			}}>
				<Grid container spacing={2} sx={{
					flexGrow: 1,
					display: "flex",
					justifyContent: "center"
				}}>
					{sizeMatches ? <Panels></Panels> : <></>}
				</Grid>
			</Box>
		</Box>
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
					}
				}}>
					<TypographyHeader sx={{color: window.siteMap[p].color,fontWeight:200,padding: "5px"}} element={"h4"}>{window.siteMap[p].items[i].name}</TypographyHeader>
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
						opacity: collapseOpen[p] ? 0.5 : 1

					}} onClick={() => {
						toggleCollapseOpen(p);

						if (window.siteMap[p].items.length === 0) {
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
						<TypographyHeader sx={{color: window.siteMap[p].color}} element={"h3"}>{window.siteMap[p].name}</TypographyHeader>
					</Box>
					<Box sx={{
						width: '100%',
						border: {
							md: `2px solid ${window.siteMap[p].color}`,
							xs: `1px solid ${window.siteMap[p].color}`
						},
						marginTop: '5px',
						backgroundColor: window.siteMap[p].backgroundColor,
						display: collapseOpen[p] ? 'block' : 'none',
					}}>
						{panelItems}
					</Box>
				</Box>

			</Grid>
		)
	}

	return panelArray;

}

export default SiteMap;