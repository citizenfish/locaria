import React from "react"
import AppBar from '@mui/material/AppBar';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function AdminAppBar(props) {
    return (
            <AppBar
                position="fixed"
                sx={{ width: `calc(100% - ${props.dw}px)`, ml: `${props.dw}px` }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" >
                        Administration
                    </Typography>
                </Toolbar>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" >
                        {props.mode == 'upload' && 'Upload Data'}
                        {props.mode == 'edit' && 'Edit Data'}
                        {props.mode == 'moderate' && 'Moderate Data'}
                        {props.mode == 'export' && 'Export Data'}
                        {props.mode == 'users' && 'Manage Users'}
                        {props.mode == 'reports' && 'Run a Report'}
                    </Typography>
                </Toolbar>

            </AppBar>
    );
}