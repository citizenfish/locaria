import React from 'react';

import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import {channels, useStyles,theme} from "../../theme/locus";
import {ThemeProvider} from '@material-ui/core/styles';

import {Link} from "react-router-dom";



const Layout = ({ children }) => {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [location, setLocation] = React.useState(null);

	const isMenuOpen = Boolean(anchorEl);

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};


	const handleMenuClose = () => {
		setAnchorEl(null);
	};


	const menuId = 'primary-search-account-menu';

	React.useEffect(() => {

		window.websocket.registerQueue("postcode", function (json) {
			setLocation(json);
			console.log(json);
		});

	}, []);



	function handleKeyDown(e) {
		let postcode=document.getElementById('myPostcode').value;
		console.log(postcode);

		window.websocket.send({
			"queue":"postcode",
			"api":"api",
			"data":{
				"method":"address_search",
				"address":postcode
			}
		});

	}

	function channelDisplay(channel) {
		if(channel.type==='Report')
			return (<MenuItem component={Link} to={`/${channel.type}/${channel.report_name}`} key={channel.key} content={channel.name}>{channel.name}</MenuItem>)
		else
			return (<MenuItem component={Link} to={`/${channel.type}/${channel.category}`} key={channel.key} content={channel.name}>{channel.name}</MenuItem>)

	}

	const renderMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			id={menuId}
			keepMounted
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			open={isMenuOpen}
			onClose={handleMenuClose}
		>
			<MenuItem component={Link} to={`/`}>Home</MenuItem>
			{channels.map(channel => (
				channelDisplay(channel)
			))}
		</Menu>
	);

	return (
		<ThemeProvider theme={theme}>
		<Container>
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
						<MenuIcon />
					</IconButton>
					<Typography className={classes.title} variant="h6" noWrap>
						Locus - My council name
					</Typography>
					<div className={classes.search}>
						<div className={classes.searchIcon}>
							<SearchIcon />
						</div>
						<InputBase
							placeholder="Search…"
							classes={{
								root: classes.inputRoot,
								input: classes.inputInput,
							}}
							inputProps={{ 'aria-label': 'search' }}
							defaultValue="PP1 1PP"
							onKeyPress={handleKeyDown}
							id="myPostcode"
						/>
					</div>
				</Toolbar>
			</AppBar>
			{renderMenu}
		</div>
		<div>
			{children}
		</div>
		</Container>
		</ThemeProvider>
	);
};


export default Layout;
