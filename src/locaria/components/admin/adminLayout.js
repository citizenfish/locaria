import React from 'react';

import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from "@mui/icons-material/Menu";
import {channels, theme, configs} from "themeLocaria";
import {useStyles} from "stylesLocaria";
import {adminTheme} from "../../../theme/admin/admin";
import {ThemeProvider} from '@mui/styles';
import {Link} from "react-router-dom";
import {useCookies} from 'react-cookie';
import Box from '@mui/material/Box';


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
