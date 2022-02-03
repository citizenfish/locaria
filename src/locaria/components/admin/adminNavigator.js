import React from "react"
import {Drawer} from "@mui/material";
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import GetAppOutlinedIcon from '@mui/icons-material/GetAppOutlined';
import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';

const dataItems = [{
    "name" : "Upload",
    "component" : "upload",
    "icon" : <DriveFolderUploadOutlinedIcon />
},{
    "name" : "Edit",
    "component" : "edit",
    "icon" : <EditOutlinedIcon />
},{
    "name" : "Moderate",
    "component" : "moderate",
    "icon" : <AssignmentTurnedInOutlinedIcon/>
},{
    "name" : "Export",
    "component" : "export",
    "icon" : <GetAppOutlinedIcon/>
}]

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

    const clickHandler = (item) => {
        props.cm(item)
    }

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
                {dataItems.map((item) => (
                    <ListItem button key={item.name} onClick={() => clickHandler(item.component)}>
                        <ListItemIcon >
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.name} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {systemItems.map((item) => (
                    <ListItem button key={item.name} onClick={() => clickHandler(item.component)}>
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