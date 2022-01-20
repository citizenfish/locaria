import React from 'react';
import {useCookies} from "react-cookie";
import {BottomNavigationAction, SpeedDial, SpeedDialAction, SpeedDialIcon} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import {resources} from "themeLocaria";
import LoginIcon from '@mui/icons-material/Login';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import {useStyles} from "stylesLocaria";
import LogoutIcon from '@mui/icons-material/Logout';

const NavProfile = () => {
	const classes = useStyles();

	const [cookies, setCookies] = useCookies(['location']);

	const handleLogin = function () {
		window.location = `https://${resources.cognitoURL}/login?response_type=token&client_id=${resources.poolClientId}&redirect_uri=http://localhost:8080/`;
	}

	const handleSignup = function () {
		window.location = `https://${resources.cognitoURL}/signup?response_type=token&client_id=${resources.poolClientId}&redirect_uri=http://localhost:8080/`;
	}

	const handleLogout = function () {
		setCookies('id_token', "null", {path: '/', sameSite: true});
		window.location = `/`;
	}

	if (cookies['id_token'] === undefined || cookies['id_token'] === "null") {
		return (
			<SpeedDial
				ariaLabel="SpeedDial basic example"
				icon={<AccountCircle fontSize="medium"/>}
				className={classes.profileDial}
				direction={'up'}
			>
				<SpeedDialAction
					key={'signup'}
					icon={<PersonAddAltIcon/>}
					tooltipTitle={'Sign up'}
					onClick={handleSignup}
				/>
				<SpeedDialAction
					key={'login'}
					icon={<LoginIcon/>}
					tooltipTitle={'Login'}
					onClick={handleLogin}
				/>

			</SpeedDial>
		)
	} else {
		return (
			<SpeedDial
				ariaLabel="SpeedDial basic example"
				icon={<AccountCircle fontSize="medium"/>}
				className={classes.profileDial}
				direction={'up'}
			>
				<SpeedDialAction
					key={'logout'}
					icon={<LogoutIcon/>}
					tooltipTitle={'Logout'}
					onClick={handleLogout}
				/>

			</SpeedDial>

		)
	}
}

export {NavProfile}