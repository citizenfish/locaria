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
import Box from "@mui/material/Box";
import UploadWidget from "../../../widgets/uploadWidget";

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

    const getCategoryData = () => {
        for(let cat in categories) {
            if(categories[cat].key===category)
                return categories[cat];
        }
    }

    const setConfig = (e) => {

        let data=getCategoryData();
        window.websocket.send({
            "queue": "setConfig",
            "api": "sapi",
            "data": {
                "method": "update_category",
                "category": category,
                id_token: cookies['id_token'],
                "attributes": data
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
            <Box sx={{margin:"50px"}}>

            <h1>Categories</h1>
            <FormControl fullWidth>
                <InputLabel id="category-label">Select category</InputLabel>
                <Select
                    labelId="category-label"
                    id="category"
                    value={category}
                    label="Category"
                    fullWidth={true}

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
                    <h1>{category}</h1>
                    <TextField
                        id="name"
                        label="Name"
                        fullWidth={true}

                        defaultValue={getCategoryData(category).key}
                        variant="filled"
                        value={getCategoryData(category).name}
                        onChange={(e)=>{
                            dispatch(setAdminCategoryValue({category:category,key:"name",value:e.target.value}));
                        }}
                    />
                    <TextField
                        id="description"
                        label="Description"
                        fullWidth={true}

                        defaultValue={"Describe me"}
                        variant="filled"
                        value={getCategoryData(category).description}
                        onChange={(e)=>{
                            dispatch(setAdminCategoryValue({category:category,key:"description",value:e.target.value}));
                        }}
                    />
                    // TODO https://github.com/mikbry/material-ui-color
                    <TextField
                        id="color"
                        label="Color"
                        fullWidth={true}

                        defaultValue={"#b2df8a"}
                        variant="filled"
                        value={getCategoryData(category).color}
                        onChange={(e)=>{
                            dispatch(setAdminCategoryValue({category:category,key:"color",value:e.target.value}));
                        }}
                    />

                    <UploadWidget></UploadWidget>

                    <Button onClick={(e) => {
                        setConfig(e)
                    }}>Save</Button>

                    <Button onClick={() => {
                        setCategory(undefined)
                    }}>Cancel</Button>
                </>

            }
            </Box>
        </Drawer>
    )
}