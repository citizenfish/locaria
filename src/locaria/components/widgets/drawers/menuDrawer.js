import React, {useEffect, useState} from "react";
import {Collapse, Divider, Drawer, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import Box from "@mui/material/Box";
import {useHistory} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

import {useDispatch, useSelector} from "react-redux";
import {closeMenuDraw} from "../../redux/slices/menuDrawerSlice";

import { resources} from "themeLocaria";


import UrlCoder from "../../../libs/urlCoder"
import List from "@mui/material/List";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import {useCookies} from "react-cookie";


const MenuDrawer = function () {

	const dispatch = useDispatch()

	const open = useSelector((state) => state.menuDraw.open);

	return (
			<Drawer
				anchor={'left'}
				open={open}
				sx={{
					'& .MuiPaper-root': {
						backgroundColor: window.systemMain.menuBackground,
						paddingRight: '40px',
						'& .MuiSvgIcon-root': {
						}
					}
				}}
				onClose={()=>{dispatch(closeMenuDraw())}}
			>
				<Box role="presentation">
					<DrawSiteMap></DrawSiteMap>
				</Box>
			</Drawer>
	);
}


function DrawSiteMap() {

	const url = new UrlCoder();
	const history = useHistory();
	const dispatch = useDispatch();
	const [cookies, setCookies] = useCookies();

	const userValid = useSelector((state) => state.userSlice.userValid);
	const groups = useSelector((state) => state.userSlice.groups);

	const [collapseOpen,setCollapseOpen] = useState({});
	const [render,forceRender]=useState(0);

	useEffect(() => {
		let state=collapseOpen;

		for (let p in window.siteMap) {
			state[p]=false;
		}

		setCollapseOpen(state);


	},[]);

	function toggleCollapseOpen(id) {
		let state=collapseOpen;
		state[id]=!state[id];
		setCollapseOpen(state);
		forceRender(render+1);

	}

	let topMenuArray=[];

	topMenuArray.push(
		<ListItem button key={"InitialHome"} onClick={() => {
			history.push('/');
			dispatch(closeMenuDraw());

		}}>
			<ListItemIcon>
				<HomeIcon sx={{color: window.systemMain.defaultIconColor}}/>
			</ListItemIcon>
			<ListItemText primary={"Home"}/>
		</ListItem>
	)

	if(userValid&&groups&&groups.indexOf('Admins')!==-1) {
		topMenuArray.push(
			<ListItem button key={"AdminHome"} onClick={() => {
				window.location='/Admin/';
			}}>
				<ListItemIcon>
					<AdminPanelSettingsIcon sx={{color: window.systemMain.defaultIconColor}}/>
				</ListItemIcon>
				<ListItemText primary={"Admin"}/>
			</ListItem>
		)
	}



	for (let p in window.siteMap) {
		let subMenuArray=[];
		for (let i in window.siteMap[p].items) {
			// Does the menu item have a group set? if so check they have it
			if(!window.siteMap[p].items[i].group||groups.indexOf(window.siteMap[p].items[i].group)!==-1) {
				subMenuArray.push(
					<ListItem sx={{pl: 4}} button key={i} onClick={() => {

						let route = url.route(window.siteMap[p].items[i].link);
						if (route === true) {
							history.push(window.siteMap[p].items[i].link);
							dispatch(closeMenuDraw());
						}
					}}>
						<ListItemText primary={window.siteMap[p].items[i].name}/>
					</ListItem>
				)
			}
		}


		topMenuArray.push(

			<ListItem button key={window.siteMap[p].key} onClick={(e) => {
				e.preventDefault();
				if(window.siteMap[p].items) {
					toggleCollapseOpen(p);
				} else {
					let route = url.route(window.siteMap[p].link);
					if (route === true) {
						history.push(window.siteMap[p].link);
						dispatch(closeMenuDraw());
					}
				}
			}}>

				<ListItemText primary={window.siteMap[p].name}/>
				{subMenuArray.length>0? (collapseOpen[p]? <ExpandLess /> : <ExpandMore />):<></>}
			</ListItem>

		)

		if(subMenuArray.length>0) {
			topMenuArray.push(
				<Collapse in={collapseOpen[p]} timeout="auto" unmountOnExit key={p+'Col'}>
					<List component="div" disablePadding>
						{subMenuArray}
					</List>
				</Collapse>
			)

		}


	}

	if(userValid===false) {
		topMenuArray.push(
			<ListItem button key={"SignIn"} onClick={() => {
				window.location = `https://${resources.cognitoURL}/login?response_type=token&client_id=${resources.poolClientId}&redirect_uri=${location.protocol}//${location.host}/`;

			}}>
				<ListItemIcon>
					<AccountCircleIcon sx={{color: window.systemMain.defaultIconColor}}/>
				</ListItemIcon>
				<ListItemText primary={"Sign in"}/>
			</ListItem>
		)
	} else {
		topMenuArray.push(
			<ListItem button key={"Logout"} onClick={() => {
				setCookies('id_token', "null", {path: '/', sameSite: true});
				window.location = `/`;
			}}>
				<ListItemIcon>
					<LogoutIcon sx={{color: window.systemMain.defaultIconColor}}/>
				</ListItemIcon>
				<ListItemText primary={"Logout"}/>
			</ListItem>
		)
	}

	return (<Box sx={{color: window.systemMain.menuColor}}>{topMenuArray}</Box>);
}

export default MenuDrawer;