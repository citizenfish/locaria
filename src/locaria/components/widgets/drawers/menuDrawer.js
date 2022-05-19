import React from "react";
import {Divider, Drawer, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import Box from "@mui/material/Box";
import {Link} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from '@mui/icons-material/Map';
import {configs} from "themeLocaria";
import {useStyles} from "stylesLocaria";

import {useDispatch, useSelector} from "react-redux";
import {closeMenuDraw} from "../../redux/slices/menuDrawerSlice";
import {openSearchDrawer} from "../../redux/slices/searchDrawerSlice";
import SearchIcon from "@mui/icons-material/Search";
import {openPageDialog} from "../../redux/slices/pageDialogSlice";
import {openLandingDraw} from "../../redux/slices/landingDrawerSlice";
import {openLayout} from "../../redux/slices/layoutSlice";
import {NavProfile} from "../navProfile";
import MenuBookIcon from '@mui/icons-material/MenuBook';




const MenuDrawer = function () {
	const classes = useStyles();
	const dispatch = useDispatch()

	const open = useSelector((state) => state.menuDraw.open);


	function channelDisplay(channel) {
		return (<ListItem button key={channel.key} onClick={() =>{dispatch(openSearchDrawer({categories:[channel.key]}));}}>
			<ListItemIcon>
				<SearchIcon/>
			</ListItemIcon>
			<ListItemText primary={channel.name}/>
		</ListItem>)
	}


	return (
			<Drawer
				anchor={'left'}
				open={open}
				className={classes.drawLeft}
				onClose={()=>{dispatch(closeMenuDraw())}}
			>
				<Box
					role="presentation"
					onClick={()=>{dispatch(closeMenuDraw())}}
					onKeyDown={()=>{dispatch(closeMenuDraw())}}
				>

					{configs.landing? <ListItem button onClick={() => {
						dispatch(openLandingDraw())
					}} key={'Intro'}>
						<ListItemIcon>
							<HomeIcon/>
						</ListItemIcon>
						<ListItemText primary={'Home'}/>
					</ListItem> : <></>}

					<ListItem button key={'Map'} onClick={() => {
						dispatch(openLayout());
					}}>
						<ListItemIcon>
							<MapIcon/>
						</ListItemIcon>
						<ListItemText primary={'Map'}/>
					</ListItem>

					<Divider/>
					<NavProfile/>
					<Divider/>

					{window.systemCategories.listChannels().map(function (channel) {
						if (window.systemCategories.displayChannel(channel))
							return channelDisplay(window.systemCategories.getChannelProperties(channel));
					})}

					<Divider/>

					{window.systemPages.map(function (page) {
						return (
							<ListItem button onClick={()=>{
								if(page.type==="link") {
									window.location=page.link;
								} else {
									dispatch(openPageDialog(page.id));
								}
							}} key={page.id}>
								<ListItemIcon>
									<MenuBookIcon/>
								</ListItemIcon>
								<ListItemText primary={page.name}/>
							</ListItem>
						)
					})}
				</Box>
			</Drawer>
	);
}

export default MenuDrawer;