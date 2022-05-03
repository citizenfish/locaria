import React from 'react';
import {useCookies} from "react-cookie";
import {
    ListItem,
    ListItemIcon,
    ListItemText,

} from "@mui/material";
import {resources, configs} from "themeLocaria";
import LoginIcon from '@mui/icons-material/Login';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import {useStyles} from "stylesLocaria";
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';


const NavProfile = () => {
    const classes = useStyles();

    const [cookies, setCookies] = useCookies(['location']);

    const handleLogin = function () {
        window.location = `https://${resources.cognitoURL}/login?response_type=token&client_id=${resources.poolClientId}&redirect_uri=${location.protocol}//${location.host}/`;
    }

    const handleSignup = function () {
        window.location = `https://${resources.cognitoURL}/signup?response_type=token&client_id=${resources.poolClientId}&redirect_uri=${location.protocol}//${location.host}/`;
    }

    const handleLogout = function () {
        setCookies('id_token', "null", {path: '/', sameSite: true});
        window.location = `/`;
    }

    if (configs.login === true) {

        if (cookies['id_token'] === undefined || cookies['id_token'] === "null") {
            return (
                <>

                    <ListItem button onClick={() => {
                        handleSignup();
                    }}>
                        <ListItemIcon>
                            <PersonAddAltIcon/>
                        </ListItemIcon>
                        <ListItemText primary={'Sign up'}/>
                    </ListItem>
                    <ListItem button onClick={() => {
                        handleLogin();
                    }}>
                        <ListItemIcon>
                            <LoginIcon/>
                        </ListItemIcon>
                        <ListItemText primary={'Login'}/>
                    </ListItem>
                </>
            )
        } else {
            return (
                <>
                    <ListItem button onClick={() => {
                        handleLogout();
                    }}>
                        <ListItemIcon>
                            <LogoutIcon/>
                        </ListItemIcon>
                        <ListItemText primary={'Logout'}/>
                    </ListItem>
                    <ListItem button onClick={() => {
                        window.location='/Admin/';
                    }}>
                        <ListItemIcon>
                            <AdminPanelSettingsIcon/>
                        </ListItemIcon>
                        <ListItemText primary={'Admin'}/>
                    </ListItem>
                </>

            )
        }
    } else {
        return (
           <></>
        )

    }
}

export {NavProfile}