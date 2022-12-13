import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import UrlCoder from "../../../libs/urlCoder";
import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import TypographyHeader from "../typography/typographyHeader";
import Grid from "@mui/material/Grid";
import {locationPopup} from "../../redux/slices/searchDrawerSlice";
import ClickAway from "../utils/clickAway";
import TypographyParagraph from "../typography/typographyParagraph";
import {encodeSearchParams} from "../../../libs/searchParams";
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import {Stack} from "@mui/material";
const SitePanels = ({open,mode,panel='small'}) => {
	const history = useHistory();
	const dispatch = useDispatch();

	const url = new UrlCoder();
	const [collapseOpen, setCollapseOpen] = useState({});
	const [render, forceRender] = useState(0);

	const currentLocation = useSelector((state) => state.searchDraw.currentLocation);


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
	let md = 12 / (2 * Math.round(window.siteMap.length / 2));
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

		let background=window.siteMap[p].backgroundColor;
		if(window.siteMap[p].key===open)
			background=window.siteMap[p].backgroundColorOpen;
		if(collapseOpen[p])
			background=window.siteMap[p].backgroundColorHover;


		/*let panelSx={...{
				backgroundColor: background,
				fontSize: "0.8rem",
				border: `1px solid ${window.siteMap[p].color}`,
				width: '100%',
				cursor: "pointer"
			},...window.siteMap[p].defaultSX
		};*/

		let panelSx={
				backgroundColor: background,
				fontSize: "0.8rem",
				border: `1px solid ${window.siteMap[p].borderColor? window.siteMap[p].borderColor:window.siteMap[p].color}`,
				width: '100%',
				cursor: "pointer"
		};

		if(panel==='big') {
			panelSx.height="200px";
			panelSx.borderRadius= "5px";
			panelSx.padding="10px";
			if(!currentLocation&&window.siteMap[p].needsLocation) {
				panelSx.opacity="0.5";
			}
			if(window.siteMap[p].backgroundImage) {
				const url = new UrlCoder();
				let urlActual = url.decode(window.siteMap[p].backgroundImage,true);
				panelSx.backgroundImage = `url(${urlActual})`;
			}

		} else {
			panelSx.borderRadius="12px";
			panelSx.padding="5px";
		}

		panelArray.push(
			<Grid item md={md} sd={6} xs={6} key={window.siteMap[p].key} >
				<Box sx={{
					textAlign: 'center',
				}}>

					<Box sx={panelSx} onClick={() => {
						toggleCollapseOpen(p);

						//if(window.siteMap[p].needsLocation&&(mode==='full'||mode==='bottom')&&currentLocation===undefined) {
						if(window.siteMap[p].needsLocation&&currentLocation===undefined) {
							dispatch(locationPopup({open:true,page:window.siteMap[p].link}));
						} else {
							if (!window.siteMap[p].items || window.siteMap[p].items.length === 0) {
								let route = url.route(window.siteMap[p].link);
								if (route === true) {
									// Are we in location mode but the selector isn't open?
									// Ok lets take our current location with us because we shouldn't be here without it
									let link=window.siteMap[p].link;
									if(window.siteMap[p].needsLocation===true) {
										link=`${window.siteMap[p].link}${encodeSearchParams({location: currentLocation.location})}`;
									}
									history.push(link);
								}
							}
						}
					}}
						 onMouseEnter={() => {
							 toggleCollapseOpen(p);
						 }}
						 onMouseLeave={() => {
							 collapseAll();
						 }}
					>
						<TypographyHeader sx={{color: collapseOpen[p] ? window.siteMap[p].colorHover:window.siteMap[p].color}}
										  element={"h3"}>{window.siteMap[p].key===open&&'['}{window.siteMap[p].name}{window.siteMap[p].key===open&&']'}</TypographyHeader>
						{window.siteMap[p].description&&panel==='big'&&
							<TypographyParagraph sx={{color: collapseOpen[p] ? window.siteMap[p].colorHover:window.siteMap[p].color,marginTop: "20px"}}>{window.siteMap[p].description}</TypographyParagraph>
						}
						<BigPannelLocation panel={panel} location={window.siteMap[p].needsLocation} p={p}/>

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

	function BigPannelLocation({panel,location,p}) {
		if(panel!=='big') {
			return (<></>);
		}
		if(currentLocation&&currentLocation.text&&location) {
			return (
				<Stack direction="row" spacing={2} sx={{marginTop: "20px"}}>
					<TravelExploreIcon sx={{
						color: collapseOpen[p] ? window.siteMap[p].colorHover : window.siteMap[p].color
					}}/>
					<TypographyParagraph sx={{
						color: collapseOpen[p] ? window.siteMap[p].colorHover : window.siteMap[p].color
					}}>{currentLocation.text}</TypographyParagraph>
				</Stack>
			)
		}
		if(!location) {
			return (
				<Stack direction="row" spacing={2} sx={{marginTop: "20px"}}>
					<TravelExploreIcon sx={{
						color: collapseOpen[p] ? window.siteMap[p].colorHover : window.siteMap[p].color
					}}/>
					<TypographyParagraph sx={{
						color: collapseOpen[p] ? window.siteMap[p].colorHover : window.siteMap[p].color
					}}>Search</TypographyParagraph>
				</Stack>
			)
		}
		return (
			<Stack direction="row" spacing={2} sx={{marginTop: "20px"}}>
				<TravelExploreIcon sx={{
					color: collapseOpen[p] ? window.siteMap[p].colorHover : window.siteMap[p].color
				}}/>
				<TypographyParagraph sx={{
					color: collapseOpen[p] ? window.siteMap[p].colorHover : window.siteMap[p].color
				}}>Set your location</TypographyParagraph>
			</Stack>
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

export default SitePanels;