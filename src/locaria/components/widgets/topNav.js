import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Box from "@material-ui/core/Box";
import AccountCircle from "@material-ui/icons/AccountCircle";
import {channels, useStyles, theme, configs} from "themeLocaria";
import MenuItem from "@material-ui/core/MenuItem";
import {Link} from "react-router-dom";
import Menu from "@material-ui/core/Menu";
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
		</Menu>
	);

	const handleLogin = function () {
		handleMenuClose();
		window.location = `https://${configs.cognitoURL}/login?response_type=token&client_id=${configs.cognitoPoolId}&redirect_uri=http://localhost:8080/`;
	}

	const handleSignup = function () {
		handleMenuClose();
		window.location = `https://${configs.cognitoURL}/signup?response_type=token&client_id=${configs.cognitoPoolId}&redirect_uri=http://localhost:8080/`;
	}

	const handleLogout = function () {
		handleMenuClose();
		setCookies('id_token', "null", {path: '/', sameSite: true});
		window.location = `/`;
	}

	const handleAdmin = function () {
		handleMenuClose();
		window.location = `/Admin/`;

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
	};


	return (
		<div className={classes.grow}>
			<AppBar position="static">
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
