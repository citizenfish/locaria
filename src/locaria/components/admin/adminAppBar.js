import React from "react"
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import {useCookies} from "react-cookie";

export default function AdminAppBar({title}) {

    const [cookies, setCookies] = useCookies(['location']);

    const handleLogout = function () {
        setCookies('id_token', "null", {path: '/', sameSite: true});
        window.location = `/`;
    }

    return (
        <AppBar sx={{
            width: `calc(100% - 240px)`,
            ml: `240px`,
            zIndex: 100,
          }}
        >
            <Toolbar sx={{ justifyContent: "space-between" }}>

                <Typography variant="h6" noWrap component="div" >
                    Administration Portal: {title}
                </Typography>

                <Button color="inherit" onClick={handleLogout}>Logout</Button>

            </Toolbar>
        </AppBar>
    );
}