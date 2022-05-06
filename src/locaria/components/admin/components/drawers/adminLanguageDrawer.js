import React, {useRef, useState} from "react"

import {Checkbox, Drawer, FormControlLabel, FormGroup, InputLabel, Select, TextField} from "@mui/material";
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
import {closeAdminPageDrawer} from "../../redux/slices/adminPageDrawerSlice";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import {closeDashboardDrawer} from "../../redux/slices/adminDashboardDrawerSlice";
import {setAdminCategories, setAdminCategoryValue} from "../../redux/slices/adminCategoryDrawerSlice";
import {setAdminLanguage} from "../../redux/slices/adminLanguageDrawerSlice";

export default function AdminLanguageDrawer(props) {

    const open = useSelector((state) => state.adminLanguageDrawer.open);
    const language = useSelector((state) => state.adminLanguageDrawer.language);
    const dispatch = useDispatch()
    const classes = useStyles();
    const isInitialMount = useRef(true);
    const history = useHistory();

    const [cookies, setCookies] = useCookies(['location']);


    const [current, setCurrent]=useState('ENG');


    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        }

        window.websocket.registerQueue('getLanguage', (json) => {
            if(json.packet[`lang${current}`])
                dispatch(setAdminLanguage(json.packet[`lang${current}`]));
            else
                dispatch(setAdminLanguage({}));
        });

        window.websocket.registerQueue('setLanguage', (json) => {
            getConfig();
        });

        if (open) {
            history.push(`/Admin/Language/`);
            dispatch(closeUploadDrawer());
            dispatch(closeEditFeatureDrawer());
            dispatch(closeAdminPageDrawer());
            dispatch(closeDashboardDrawer());

            dispatch(setTitle('Language'));
            getConfig();
        }

    }, [open]);

    const getConfig = () => {
        window.websocket.send({
            "queue": "getLanguage",
            "api": "api",
            "data": {
                "method": "get_parameters",
                "parameter_name": `lang${current}`,
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
                "parameter_name": `lang${current}`,
                id_token: cookies['id_token'],
                "parameters": language
            }
        });
        window.systemLanguage=language;
    }


    return (
        <Drawer
            anchor="right"
            open={open}
            variant="persistent"
            className={classes.adminDrawers}

        >
            <h1>Language</h1>


        </Drawer>
    )
}