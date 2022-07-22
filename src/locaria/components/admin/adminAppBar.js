import React from "react"
import AppBar from '@mui/material/AppBar';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {useSelector} from "react-redux";

export default function AdminAppBar({title}) {

    return (
        <AppBar sx={{
            width: `calc(100% - 240px)`,
            ml: `240px`,
            zIndex: 100,
          }}
        >
            <Toolbar>
                <Typography variant="h6" noWrap component="div" >
                    Administration: {title}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}