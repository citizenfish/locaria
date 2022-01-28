import React, {useRef} from 'react';
import MenuIcon from "@mui/icons-material/Menu";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import {channels, configs, pages} from "themeLocaria";
import {useStyles} from "stylesLocaria";
import {NavProfile} from "./navProfile";
import {Link} from "react-router-dom";
import {useCookies} from "react-cookie";
import {
	BottomNavigation,
	BottomNavigationAction,
	Divider,
	Drawer, Fade,
	ListItem,
	ListItemIcon,
	ListItemText, Popper
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import {IntroModal} from "./intro";


import {SearchDraw} from "./searchDraw";
import {ViewDraw} from "./viewDraw";

const Nav = () => {
	const classes = useStyles();
	const [leftDraw, setLeftDraw] = React.useState(false);
	const [cookies, setCookies] = useCookies(['location']);


	const searchRef = useRef();
	const viewRef = useRef();




	const handleDrawOpen = (e) => {
		setLeftDraw(true);
	};


	const handleDrawClose = () => {
		setLeftDraw(false);
	};





	function handleKeyDown(e) {
		if (e.key === 'Enter') {
			let postcode = document.getElementById('myPostcode').value;
			postcode = postcode.toUpperCase();
			document.getElementById('myPostcode').value = postcode;

			window.websocket.send({
				"queue": "postcode",
				"api": "api",
				"data": {
					"method": "address_search",
					"address": postcode
				}
			});

		}

	}

	function channelDisplay(channel) {
		if (channel.type === 'Report' && channel.noCategory !== undefined && channel.noCategory === true)

			return (<ListItem button component={Link} to={`/Report/${channel.report_name}`} key={channel.key}>
				<ListItemIcon>
					<SearchIcon/>
				</ListItemIcon>
				<ListItemText primary={channel.name}/>
			</ListItem>)
		else
			return (<ListItem button component={Link} to={`/Category/${channel.key}`} key={channel.key}>
				<ListItemIcon>
					<SearchIcon/>
				</ListItemIcon>
				<ListItemText primary={channel.name}/>
			</ListItem>)
	}


	const RenderDraw = function() {
		return(
			<React.Fragment key={'leftDraw'}>
				<Drawer
					anchor={'left'}
					open={leftDraw}
					onClose={handleDrawClose}
					className={classes.drawLeft}
				>
					<Box
						role="presentation"
						onClick={handleDrawClose}
						onKeyDown={handleDrawClose}
					>

						<ListItem button key={'Home'} component={Link} to={`/`}>
							<ListItemIcon>
								<HomeIcon/>
							</ListItemIcon>
							<ListItemText primary={'Home'}/>
						</ListItem>

						<Divider/>

						{channels.listChannels().map(function (channel) {
							if (channels.displayChannel(channel))
								return channelDisplay(channels.getChannelProperties(channel));
						})}

						<Divider/>

						{pages.listPages().map(function(page) {
							return (
								<ListItem button component={Link} to={`/Page/${page.page}`} key={page.page}>
									<ListItemIcon>
										{page.icon}
									</ListItemIcon>
									<ListItemText primary={page.title}/>
								</ListItem>
							)
						})}
					</Box>
				</Drawer>
			</React.Fragment>
		);
	}


	function LocationSearch() {
		if (configs.navShowHome !== false) {
			return (
				<div className={classes.search}>
					<div className={classes.searchIcon}>
						<SearchIcon/>
					</div>
					<InputBase
						placeholder="Postcode…"
						classes={{
							root: classes.inputRoot,
							input: classes.inputInput,
						}}
						inputProps={{'aria-label': 'search'}}
						defaultValue={cookies.postcode ? cookies.postcode : configs.defaultPostcode}
						onKeyPress={handleKeyDown}
						id="myPostcode"
					/>
				</div>
			)
		} else {
			return (<Box sx={{flexGrow: 1}}/>)
		}
	}

	const openSearchWrapper=function() {
		viewRef.current.closeViewDraw();
		searchRef.current.toggleSearchDraw();
	}

	const openViewWrapper=function(type,category,reportId,fid) {
		viewRef.current.toggleViewDraw(type,category,reportId,fid);
	}

	return (
		<div className={classes.grow}>
			<IntroModal/>
			<BottomNavigation className={classes.nav} id={"navMain"}>

				<BottomNavigationAction label="Menu" icon={<MenuIcon color="icons"/>}  onClick={handleDrawOpen}/>
				<BottomNavigationAction label="Search"  icon={<SearchIcon color="secondary" fontSize="large"/>} onClick={openSearchWrapper}/>
				<NavProfile/>
			</BottomNavigation>
			<SearchDraw ref={searchRef} viewWrapper={openViewWrapper}/>
			<RenderDraw/>
			<ViewDraw ref={viewRef}/>
		</div>
	)
}

export default Nav;
