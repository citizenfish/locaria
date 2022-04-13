import React, {useRef, useState} from "react"

import {Drawer, TextField} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {closeUploadDrawer} from "../../redux/slices/uploadDrawerSlice";
import {closeEditFeatureDrawer} from "../../redux/slices/editFeatureDrawerSlice";
import {setTitle} from "../../redux/slices/adminSlice";
import {useStyles} from "../../../../../theme/default/adminStyle";
import {useHistory} from "react-router-dom";
import Button from "@mui/material/Button";
import {setEditData} from "../../redux/slices/editDrawerSlice";
import {setSystemConfig, setSystemConfigValue} from "../../redux/slices/systemConfigDrawerSlice";
import {useCookies} from "react-cookie";
import Slider from "@mui/material/Slider";

export default function AdminSystemConfigDrawer(props) {

    const open = useSelector((state) => state.systemConfigDrawer.open);
    const config = useSelector((state) => state.systemConfigDrawer.config);
    const dispatch = useDispatch()
    const classes = useStyles();
    const isInitialMount = useRef(true);
    const history = useHistory();

    const [cookies, setCookies] = useCookies(['location'])


    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        }

        window.websocket.registerQueue('getConfig', (json) => {
            if(json.packet.systemMain)
                dispatch(setSystemConfig(json.packet.systemMain));
            else
                dispatch(setSystemConfig({}));
        });

        window.websocket.registerQueue('setConfig', (json) => {
            getConfig();
        });

        if (open) {
            history.push(`/Admin/System/`);
            dispatch(closeUploadDrawer())
            dispatch(closeEditFeatureDrawer())
            dispatch(setTitle('System'));
            getConfig();
        }

    }, [open]);

    const getConfig = () => {
        window.websocket.send({
            "queue": "getConfig",
            "api": "sapi",
            "data": {
                "method": "get_parameters",
                "parameter_name": "systemMain",
                id_token: cookies['id_token'],

            }
        });
    }

    const setConfig = (e) => {
        window.websocket.send({
            "queue": "setConfig",
            "api": "sapi",
            "data": {
                "method": "set_parameters",
                "acl": "external",
                "parameter_name": "systemMain",
                id_token: cookies['id_token'],
                "parameters": config
            }
        });
        window.systemMain=config;
    }


    return (
        <Drawer
            anchor="right"
            open={open}
            variant="persistent"
            className={classes.adminDrawers}

        >
            {config ? (
                <>
                    <h1>Search</h1>
                    <TextField
                        id="searchLimit"
                        label="Search limit"
                        defaultValue={40}
                        variant="filled"
                        value={config.searchLimit}
                        onChange={(e)=>{
                            dispatch(setSystemConfigValue({key:"searchLimit",value:parseInt(e.target.value)}));
                        }}

                    />
                    <h1>Maps</h1>
                    <TextField
                        id="mapXYZ"
                        label="mapXYZ URL"
                        defaultValue={"https://api.os.uk/maps/raster/v1/zxy/Road_3857/{z}/{x}/{y}.png?key=w69znUGxB6IW5FXkFMH5LQovdZxZP7jv"}
                        variant="filled"
                        value={config.mapXYZ}
                        onChange={(e)=>{
                            dispatch(setSystemConfigValue({key:"mapXYZ",value:e.target.value}));
                        }}
                    />
                    <TextField
                        id="mapAttribution"
                        label="Attribution"
                        defaultValue={"© Crown copyright and database rights 2022 OS"}
                        variant="filled"
                        value={config.mapAttribution}
                        onChange={(e)=>{
                            dispatch(setSystemConfigValue({key:"mapAttribution",value:e.target.value}));
                        }}
                    />
                    <TextField
                        id="mapBuffer"
                        label="Buffer"
                        defaultValue={50000}
                        variant="filled"
                        value={config.mapBuffer}
                        onChange={(e)=>{
                            dispatch(setSystemConfigValue({key:"mapBuffer",value:parseInt(e.target.value)}));
                        }}
                    />
                    <h2>Default Zoom</h2>
                    <Slider
                        id="defaultZoom"
                        aria-label="Default Zoom"
                        value={config.defaultZoom}
                        defaultValue={15}
                        min={1}
                        max={25}
                        step={1}
                        valueLabelDisplay="on"
                        onChange={(e)=>{
                            dispatch(setSystemConfigValue({key:"defaultZoom",value:parseInt(e.target.value)}));
                        }}
                    />
                    <h2>Cluster cut off</h2>
                    <Slider
                        id="clusterCutOff"
                        aria-label="Cluster cut off"
                        value={config.clusterCutOff}
                        defaultValue={5}
                        min={1}
                        max={25}
                        step={1}
                        valueLabelDisplay="on"
                        onChange={(e)=>{
                            dispatch(setSystemConfigValue({key:"clusterCutOff",value:parseInt(e.target.value)}));
                        }}
                    />
                    <TextField
                        id="clusterWidthMod"
                        label="clusterWidthMod"
                        defaultValue={20}
                        variant="filled"
                        value={config.clusterWidthMod}
                        onChange={(e)=>{
                            dispatch(setSystemConfigValue({key:"clusterWidthMod",value:parseInt(e.target.value)}));
                        }}
                    />
                    <TextField
                        id="clusterAlgorithm"
                        label="clusterAlgorithm"
                        defaultValue={50000}
                        variant="filled"
                        value={config.clusterAlgorithm}
                        onChange={(e)=>{
                            dispatch(setSystemConfigValue({key:"clusterAlgorithm",value:parseInt(e.target.value)}));
                        }}
                    />

                    <Button onClick={(e) => {
                        setConfig(e)
                    }}>Save</Button>
                </>) : (<></>)
            }

        </Drawer>
    )
}