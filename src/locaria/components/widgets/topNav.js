import React from 'react';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import AccountCircle from "@mui/icons-material/AccountCircle";
import {channels, configs,resources,pages} from "themeLocaria";
import {useStyles} from "stylesLocaria";

import MenuItem from "@mui/material/MenuItem";
import {Link} from "react-router-dom";
import Menu from "@mui/material/Menu";
import {useCookies} from "react-cookie";


const TopNav = () => {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [anchorProfileEl, setAnchorProfileEl] = React.useState(null);
	const isMenuOpen = Boolean(anchorEl);
	const isProfileMenuOpen = Boolean(anchorProfileEl);
	const [cookies, setCookies] = useCookies(['location']);

	const handleMenuOpen = (e) => {
		setAnchorEl(e.currentTarget);
	};


	const handleMenuClose = () => {
		setAnchorEl(null);
		setAnchorProfileEl(null);
	};

	const handleProfileMenuOpen = (e) => {
		setAnchorProfileEl(e.currentTarget);

	}

	const menuId = 'primary-search-account-menu';

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
			return (<MenuItem component={Link} to={`/Report/${channel.report_name}`} key={channel.key}
			                  content={channel.name}>{channel.name}</MenuItem>)
		else
			return (<MenuItem component={Link} to={`/Category/${channel.key}`} key={channel.key}
			                  content={channel.name}>{channel.name}</MenuItem>)

	}


	const renderMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{vertical: 'top', horizontal: 'right'}}
			id={menuId}
			keepMounted
			transformOrigin={{vertical: 'top', horizontal: 'right'}}
			open={isMenuOpen}
			onClose={handleMenuClose}
		>
			<MenuItem key={'Home'} component={Link} to={`/`}>Home</MenuItem>
			{channels.listChannels().map(function (channel) {
				if (channels.displayChannel(channel))
					return channelDisplay(channels.getChannelProperties(channel));
			})}
			{pages.listPages().map(function(page) {
					return (
						<MenuItem component={Link} to={`/Page/${page.page}`} key={page.page}
						          content={page.title}>{page.title}</MenuItem>
					)
			})}
		</Menu>
	);

	const handleLogin = function () {
		handleMenuClose();
		window.location = `https://${resources.cognitoURL}/login?response_type=token&client_id=${resources.poolClientId}&redirect_uri=http://localhost:8080/`;
	}

	const handleSignup = function () {
		handleMenuClose();
		window.location = `https://${resources.cognitoURL}/signup?response_type=token&client_id=${resources.poolClientId}&redirect_uri=http://localhost:8080/`;
	}

	const handleLogout = function () {
		handleMenuClose();
		setCookies('id_token', "null", {path: '/', sameSite: true});
		window.location = `/`;
	}

	function renderProfileMenu() {
		if (cookies['id_token'] === undefined || cookies['id_token'] === "null") {
			return (
				<Menu
					anchorEl={anchorProfileEl}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					id={menuId}
					keepMounted
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					open={isProfileMenuOpen}
					onClose={handleMenuClose}
				>
					<MenuItem key={"Login"} onClick={handleLogin}>Login</MenuItem>
					<MenuItem key={"Signup"} onClick={handleSignup}>Signup</MenuItem>
				</Menu>
			)
		} else {
			return (
				<Menu
					anchorEl={anchorProfileEl}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					id={menuId}
					keepMounted
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					open={isProfileMenuOpen}
					onClose={handleMenuClose}
				>
					<MenuItem key={"Logout"} onClick={handleLogout}>Logout</MenuItem>
					{cookies.groups.indexOf('Admins') !== -1 ?
						<MenuItem component={Link} to={`/Admin/`} key={"adminLink"}>Admin</MenuItem> : ''}
				</Menu>
			)
		}
	}

	function LocationSearch() {
		if(configs.navShowHome!==false){
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

	return (
		<div className={classes.grow}>
			<AppBar position="static" color="primary">
				<Toolbar>
					<IconButton
						edge="start"
						className={classes.menuButton}
						color="inherit"
						aria-label="open drawer"
						onClick={handleMenuOpen}
					>
						<MenuIcon/>
					</IconButton>
					<Typography className={classes.title} variant="h6" noWrap>
						{configs.siteTitle}
					</Typography>

					<LocationSearch/>

					<Box sx={{flexGrow: 1}}/>
					<Box sx={{display: {xs: 'none', md: 'flex'}}}>
						<IconButton
							size="medium"
							edge="end"
							aria-label="account of current user"
							aria-controls={menuId}
							aria-haspopup="true"
							onClick={handleProfileMenuOpen}
							color="inherit"
						>
							<AccountCircle/>
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>
			{renderMenu}
			{renderProfileMenu()}
		</div>
	)
}

export default TopNav;
