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
import {channels, useStyles,theme,configs} from "../../theme/locus";
import {ThemeProvider} from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {Link} from "react-router-dom";
import Openlayers from "../libs/Openlayers";
import Paper from "@material-ui/core/Paper";
import { useCookies } from 'react-cookie';


const Layout = ({ children,map }) => {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);

	const [openError, setOpenError] = React.useState(false);

	const [location, setLocation] = useCookies(['location']);


	const ol=new Openlayers();

	const isMenuOpen = Boolean(anchorEl);

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};


	const handleMenuClose = () => {
		setAnchorEl(null);
	};


	const menuId = 'primary-search-account-menu';

	React.useEffect(() => {

		if(map===true) {

			ol.addMap({
				"target": "map",
				"projection": "EPSG:3857",
				"renderer": ["canvas"],
				"zoom": 10,
				center: configs.defaultLocation
			});
			ol.addLayer({
				"name": "xyz",
				"type": "xyz",
				"url": `https://api.os.uk/maps/raster/v1/zxy/${configs.OSLayer}/{z}/{x}/{y}.png?key=${configs.OSKey}`,
				"active": true
			});
			if(location.location) {
				console.log(location);
				ol.flyTo({"coordinate":location.location,"projection":"EPSG:4326"});
			} else {
				console.log('no location');
			}
		}

		window.websocket.registerQueue("postcode", function (json) {
			if(json.packet.features.length>0) {
				let postcode = document.getElementById('myPostcode').value;
				setLocation('location', json.packet.features[0].geometry.coordinates, {path: '/'});
				setLocation('postcode', postcode, {path: '/'});

				if(map===true) {
					console.log('Moving to');
					ol.flyTo({"coordinate": json.packet.features[0].geometry.coordinates, "projection": "EPSG:4326"});
				}
				console.log(json.packet.features[0].geometry.coordinates);

 			} else {
				setOpenError(true);
				console.log(json);
			}
		});

	}, []);

	function closeError() {
		setOpenError(false);
	}

	function handleKeyDown(e) {
		if( e.key === 'Enter') {
			let postcode = document.getElementById('myPostcode').value;
			console.log(postcode);

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
						{configs.siteTitle}
					</Typography>
					<div className={classes.search}>
						<div className={classes.searchIcon}>
							<SearchIcon />
						</div>
						<InputBase
							placeholder="Postcode…"
							classes={{
								root: classes.inputRoot,
								input: classes.inputInput,
							}}
							inputProps={{ 'aria-label': 'search' }}
							defaultValue={location.postcode? location.postcode:configs.defaultPostcode}
							onKeyPress={handleKeyDown}
							id="myPostcode"
						/>
					</div>
				</Toolbar>
			</AppBar>
			{renderMenu}
		</div>
		<div>
			{displayMap()}

			{children}

			<Snackbar open={openError} autoHideDuration={3000} onClose={closeError} anchorOrigin={{vertical: 'top',horizontal: 'center'}}>
				<Alert severity="error">
					Postcode not found — <strong>try another!</strong>
				</Alert>
			</Snackbar>

		</div>

		</Container>
		</ThemeProvider>
	);

	function displayMap() {
		if(map===true) {
			return (
				<Paper elevation={3} className={classes.paperMargin}>
					<div className={classes.mapContainer + " no-controls"}>
						<div id="map" className={classes.map}></div>
						<div id="pointer" className={classes.pointer}></div>
					</div>
				</Paper>
			)
		}
	}
};


export default Layout;
