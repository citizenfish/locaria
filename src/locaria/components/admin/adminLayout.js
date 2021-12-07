import React from 'react';

import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from "@material-ui/icons/Menu";
import {channels, useStyles, theme, configs} from "themeLocus";
import {adminTheme} from "../../../theme/admin/admin";
import {ThemeProvider} from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import {useCookies} from 'react-cookie';
import Box from '@material-ui/core/Box';


const AdminLayout = ({children}) => {

	const classes = useStyles();

	const [anchorEl, setAnchorEl] = React.useState(null);

	const isMenuOpen = Boolean(anchorEl);

	const handleMenuOpen = (e) => {
		setAnchorEl(e.currentTarget);
	};


	const handleMenuClose = () => {
		setAnchorEl(null);
	};


	const menuId = 'primary-search-account-menu';

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
			<MenuItem component={Link} to={`/`}>Exit Admin</MenuItem>
			<MenuItem component={Link} to={`/AdminData/`}>Data Manager</MenuItem>
			<MenuItem component={Link} to={`/AdminLoader/`}>Loader</MenuItem>
		</Menu>
	);


	return (
		<ThemeProvider theme={adminTheme}>
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
								<MenuIcon/>
							</IconButton>
							<Typography className={classes.title} variant="h6" noWrap>
								{configs.siteTitle} Admin
							</Typography>
							<Box sx={{flexGrow: 1}}/>
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


export default AdminLayout;
