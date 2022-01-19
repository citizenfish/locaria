import React from 'react';
import {useCookies} from "react-cookie";
import {BottomNavigationAction} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import {resources} from "themeLocaria";


const Profile = () => {
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
			<BottomNavigationAction label="Menu" icon={<AccountCircle  color="icons"/>} onClick={handleLogin}/>

			/*			<Menu
								/!*
													anchorEl={anchorProfileEl}
								*!/
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
							</Menu>*/
		)
	} else {
		return (
			<BottomNavigationAction label="Menu" icon={<AccountCircle  color="icons"/>} onClick={handleLogout}/>

			/*<Menu
					/!*
										anchorEl={anchorProfileEl}
					*!/
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
				</Menu>*/
		)
	}
}

export {Profile}