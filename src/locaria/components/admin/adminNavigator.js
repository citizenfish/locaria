import React from "react"
import {Drawer} from "@mui/material";
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';
import {useDispatch, useSelector} from "react-redux";
import {openComponent} from "./redux/slices/adminSlice";


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

    const components = useSelector((state) => state.admin.components);
    const dispatch = useDispatch()

    const clickHandler = (id) => {
        dispatch(openComponent(id))
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
                {components.map((item) => (
                    <ListItem button key={item.id} onClick={() => clickHandler(item.id)}>
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