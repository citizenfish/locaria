import React from "react"
import {Drawer, Typography} from "@mui/material";
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';
import {useDispatch, useSelector} from "react-redux";
import {openEditDrawer} from "../../../deprecated/editDrawerSlice";
import {openUploadDrawer} from "../../../deprecated/uploadDrawerSlice";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import EditIcon from '@mui/icons-material/Edit';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import LanguageIcon from '@mui/icons-material/Language';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import {useCookies} from "react-cookie";
import Badge from '@mui/material/Badge';
import {setTotal} from "../../../deprecated/adminSlice";
import {useHistory} from "react-router-dom";
import {openSystemConfigDrawer} from "../../../deprecated/systemConfigDrawerSlice";
import {openAdminPageDrawer} from "./redux/slices/adminPagesSlice";
import {openDashboardDrawer} from "../../../deprecated/adminDashboardDrawerSlice";
import {openAdminCategoryDrawer} from "../../../deprecated/adminCategoryDrawerSlice";
import {openLanguageDrawer} from "../../../deprecated/adminLanguageDrawerSlice";

const systemItems = [{
    "name" : "Users",
    "component" : "users",
    "icon" : <GroupIcon/>
}, {
    "name": "Reports",
    "component" : "reports",
    "icon" : <AssessmentIcon/>
}]

//TODO is this deprecated?

export default function AdminNavigator(props) {

    const dispatch = useDispatch();
    const [cookies, setCookies] = useCookies(['location']);
    const total = useSelector((state) => state.adminSlice.total);
    const history = useHistory();


    React.useEffect(() => {

        if (total === -1) {
            window.websocket.send({
                "queue": "updateTotals",
                "api": "sapi",
                "data": {
                    "method": "view_report",
                    "id_token": cookies['id_token']
                }
            });
        }

        window.websocket.registerQueue("updateTotals", function (json) {
            let totals = json.packet.add_item + json.packet.delete_item + json.packet.update_item;
            dispatch(setTotal(totals));
        });

    },[total]);

    window.websocket.registerQueue("refreshView", function (json) {
        dispatch(setTotal(-1));
    });



    function refresh() {
        window.websocket.send({
            "queue": "refreshView",
            "api": "sapi",
            "data": {
                "method": "refresh_search_view",
                "id_token": cookies['id_token']
            }
        });
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
                    paddingTop: '64px',
                    zIndex: 101,
                },
            }}
            >
            <Divider />
            <List sx={{paddingTop: 0}}>
                <ListItem button onClick={() => {    history.push(`/`);}}>
                    <ListItemIcon >
                            <HomeOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary={`Back to client`} />
                </ListItem>
                <Divider />
                <ListItem button onClick={() => dispatch(openSystemConfigDrawer())}>
                    <ListItemIcon >
                        <EditIcon />
                    </ListItemIcon>
                    <ListItemText primary={"System Config"} />
                </ListItem>

                <ListItem button onClick={() => dispatch(openAdminPageDrawer())}>
                    <ListItemIcon >
                        <MenuBookIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Edit pages"} />
                </ListItem>

                <ListItem button onClick={() => dispatch(openAdminCategoryDrawer())}>
                    <ListItemIcon >
                        <FormatListBulletedIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Configure categories"} />
                </ListItem>


                <ListItem button onClick={() => dispatch(openLanguageDrawer())}>
                    <ListItemIcon >
                        <LanguageIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Language"} />
                </ListItem>

                <Divider />

                <ListItem button onClick={() => dispatch(openDashboardDrawer())}>
                    <ListItemIcon >
                        <EqualizerIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Dashboard"} />
                </ListItem>


                <Divider />
                <ListItem button onClick={() => refresh()}>
                        <ListItemIcon >
                            <Badge color="secondary" badgeContent={total}>
                                <RotateLeftIcon />
                            </Badge>
                        </ListItemIcon>
                    <ListItemText primary={`Refresh view`} />
                </ListItem>

                <ListItem button onClick={() => dispatch(openUploadDrawer())}>
                    <ListItemIcon >
                        <DriveFolderUploadOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Upload Data"} />
                </ListItem>
                <ListItem button onClick={() => dispatch(openEditDrawer())}>
                    <ListItemIcon >
                        <EditLocationIcon />
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