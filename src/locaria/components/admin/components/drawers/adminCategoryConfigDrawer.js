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
import {closeLanguageDrawer} from "../../redux/slices/adminLanguageDrawerSlice";

export default function AdminCategoryConfigDrawer(props) {

    const open = useSelector((state) => state.adminCategoryDrawer.open);
    const categories = useSelector((state) => state.adminCategoryDrawer.categories);
    const dispatch = useDispatch()
    const classes = useStyles();
    const isInitialMount = useRef(true);
    const history = useHistory();

    const [cookies, setCookies] = useCookies(['location']);

    const [category,setCategory]= useState(undefined);


    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        }

        window.websocket.registerQueue('getCategories', (json) => {
            if(json.packet.categories)
                dispatch(setAdminCategories(json.packet.categories));
            else
                dispatch(setAdminCategories({}));
        });

        window.websocket.registerQueue('setConfig', (json) => {
            getConfig();
        });

        if (open) {
            history.push(`/Admin/Category/`);
            dispatch(closeUploadDrawer());
            dispatch(closeEditFeatureDrawer());
            dispatch(closeAdminPageDrawer());
            dispatch(closeDashboardDrawer());
            dispatch(closeLanguageDrawer());

            dispatch(setTitle('System'));
            getConfig();
        }

    }, [open]);

    const getConfig = () => {
        window.websocket.send({
            "queue": "getCategories",
            "api": "api",
            "data": {
                "method": "list_categories",
                "attributes" : "true"

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
                "parameter_name": "systemCategories",
                id_token: cookies['id_token'],
                "parameters": categories
            }
        });
        window.systemCategories=categories;
    }


    return (
        <Drawer
            anchor="right"
            open={open}
            variant="persistent"
            className={classes.adminDrawers}

        >
            <h1>Categories</h1>
            <FormControl fullWidth>
                <InputLabel id="category-label">Select category</InputLabel>
                <Select
                    labelId="category-label"
                    id="category"
                    value={category}
                    label="Category"
                    onChange={(e)=>{
                        setCategory(e.target.value);
                    }}
                >
                    {categories.map(value => (
                        <MenuItem value={value.key}>{value.key}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {category &&
                <>
                    <h1>{category.key}</h1>
                <TextField
                    id="name"
                    label="Name"
                    defaultValue={category.key}
                    variant="filled"
                    value={category.name}
                    onChange={(e)=>{
                        dispatch(setAdminCategoryValue({category:category.key,key:"name",value:e.target.value}));
                    }}
                />
                <Button onClick={(e) => {
                    setConfig(e)
                }}>Save</Button>
                </>
            }

        </Drawer>
    )
}