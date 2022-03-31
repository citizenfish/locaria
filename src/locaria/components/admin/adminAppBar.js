import React from "react"
import AppBar from '@mui/material/AppBar';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function AdminAppBar(props) {

    return (
            <AppBar
                sx={{ width: `calc(100% - ${props.dw}px)`, ml: `${props.dw}px` }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" >
                        Administration
                    </Typography>
                </Toolbar>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" >
                       {/* {selectedComponent.name}*/}
                    </Typography>
                </Toolbar>

            </AppBar>
    );
}