import React from "react"
import {Drawer} from "@mui/material";
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';
import {useDispatch, useSelector} from "react-redux";
import {openEditDrawer} from "./redux/slices/editDrawerSlice";
import {openUploadDrawer} from "./redux/slices/uploadDrawerSlice";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";

const systemItems = [{
    "name" : "Users",
    "component" : "users",
    "icon" : <GroupIcon/>
}, {
    "name": "Reports",
    "component" : "reports",
    "icon" : <AssessmentIcon/>
}]


export default function AdminNavigator(props) {

    const dispatch = useDispatch()


    return (
        <Drawer
            variant = "permanent"
            anchor = "left"
            sx={{
                width: props.dw,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: props.dw,
                    boxSizing: 'border-box',
                },
            }}
            >
            <Toolbar />
            <Toolbar />
            <Divider />
            <List>
                <ListItem button onClick={() => dispatch(openUploadDrawer())}>
                    <ListItemIcon >
                        <DriveFolderUploadOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Upload Data"} />
                </ListItem>
                <ListItem button onClick={() => dispatch(openEditDrawer())}>
                    <ListItemIcon >
                        <DriveFolderUploadOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Edit Data"} />
                </ListItem>
            </List>
            <Divider />
            <List>
                {systemItems.map((item) => (
                    <ListItem button key={item.name}>
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.name} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    )
}