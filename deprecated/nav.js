import React, {useRef} from 'react';
import MenuIcon from "@mui/icons-material/Menu";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import {channels, configs, pages} from "themeLocaria";
import {useStyles} from "stylesLocaria";
import {NavProfile} from "../locaria/components/widgets/navProfile";
import {Link, useHistory, useLocation, useParams} from "react-router-dom";
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


import {SearchDrawer} from "../locaria/components/widgets/drawers/searchDrawer";
import {ViewDrawer} from "../locaria/components/widgets/drawers/viewDrawer";

const Nav = () => {
	const classes = useStyles();
	const [leftDraw, setLeftDraw] = React.useState(false);

	const location = useLocation();
	let {feature} = useParams();

	const searchRef = useRef();
	const viewRef = useRef();

	React.useEffect(() => {
		if(location.pathname==='/Search/') {
			searchRef.current.toggleSearchDrawer();
		}
		if(feature) {
			openViewWrapper(feature,true);
		}

	}, []);


	const handleDrawOpen = (e) => {
		setLeftDraw(true);
	};


	const handleDrawClose = () => {
		setLeftDraw(false);
	};





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


	const toggleSearchWrapper=function() {
		viewRef.current.closeViewDraw();
		searchRef.current.toggleSearchDrawer();
	}

	const openViewWrapper=function(fid) {
		viewRef.current.toggleViewDraw(fid);
	}

	return (
		<div className={classes.grow}>
			<IntroModal/>
			<BottomNavigation className={classes.nav} id={"navMain"}>
				<BottomNavigationAction className={classes.NavMenuButton} label="Menu" icon={<MenuIcon color="icons"/>}  onClick={handleDrawOpen}/>
				<BottomNavigationAction className={classes.NavSearchButton} label="Search"  icon={<SearchIcon color="secondary"/>} onClick={toggleSearchWrapper}/>
				<NavProfile/>
			</BottomNavigation>
			<SearchDrawer ref={searchRef} viewWrapper={openViewWrapper}/>
			<RenderDraw/>
			<ViewDrawer ref={viewRef}/>
		</div>
	)
}

export default Nav;
