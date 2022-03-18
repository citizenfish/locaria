import React from "react";
import {Divider, Drawer, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import Box from "@mui/material/Box";
import {Link} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from '@mui/icons-material/Map';
import {configs, channels, pages} from "themeLocaria";
import {useStyles} from "stylesLocaria";

import {useDispatch, useSelector} from "react-redux";
import {closeMenuDraw} from "../../redux/slices/menuDrawSlice";
import {openSearchDraw} from "../../redux/slices/searchDrawSlice";
import SearchIcon from "@mui/icons-material/Search";
import {openPageDialog} from "../../redux/slices/pageDialogSlice";
import {openLandingDraw} from "../../redux/slices/landingDrawSlice";



const MenuDraw = function () {
	const classes = useStyles();
	const dispatch = useDispatch()

	const open = useSelector((state) => state.menuDraw.open);

	function channelDisplay(channel) {
		return (<ListItem button key={channel.key} onClick={() =>{dispatch(openSearchDraw({categories:[channel.category]}));}}>
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

					{configs.landing? <ListItem onClick={() => {
						dispatch(openLandingDraw())
					}} key={'Intro'}>
						<ListItemIcon>
							<HomeIcon/>
						</ListItemIcon>
						<ListItemText primary={'Home'}/>
					</ListItem> : <></>}

					<ListItem button key={'Map'} component={Link} to={`/Map`}>
						<ListItemIcon>
							<MapIcon/>
						</ListItemIcon>
						<ListItemText primary={'Map'}/>
					</ListItem>


					<Divider/>

					{channels.listChannels().map(function (channel) {
						if (channels.displayChannel(channel))
							return channelDisplay(channels.getChannelProperties(channel));
					})}

					<Divider/>

					{pages.listPages().map(function (page) {
						return (
							<ListItem onClick={()=>{
								if(page.type==="link") {
									window.location=page.link;
								} else {
									dispatch(openPageDialog(page.id));
								}
							}} key={page.id}>
								<ListItemIcon>
									{page.icon}
								</ListItemIcon>
								<ListItemText primary={page.title}/>
							</ListItem>
						)
					})}
				</Box>
			</Drawer>
	);
}

export default MenuDraw;