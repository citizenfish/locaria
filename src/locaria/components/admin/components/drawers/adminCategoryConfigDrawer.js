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
import {
    closeSystemConfigDrawer,
    setSystemConfig,
    setSystemConfigValue
} from "../../redux/slices/systemConfigDrawerSlice";
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
import Channels from "../../../../libs/Channels";
import { ColorPicker } from 'mui-color';
import Divider from "@mui/material/Divider";


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
            dispatch(closeSystemConfigDrawer());

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

    const setPanel=(uuid) => {
        dispatch(setAdminCategoryValue({category:category,key:"image",value:uuid}));

    }

    const setIcon=(uuid) => {
        dispatch(setAdminCategoryValue({category:category,key:"mapIcon",value:uuid}));

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
        window.systemCategories=new Channels(categories);

        setCategory(undefined);

    }

    if(category) {
        return (
            <>
                <h1>{category}</h1>
                <TextField
                    id="name"
                    label="Name"
                    fullWidth={true}
                    variant="filled"
                    value={getCategoryData(category).name}
                    onChange={(e) => {
                        dispatch(setAdminCategoryValue({
                            category: category,
                            key: "name",
                            value: e.target.value
                        }));
                    }}
                />
                <TextField
                    id="description"
                    label="Description"
                    fullWidth={true}
                    variant="filled"
                    value={getCategoryData(category).description}
                    onChange={(e) => {
                        dispatch(setAdminCategoryValue({
                            category: category,
                            key: "description",
                            value: e.target.value
                        }));
                    }}
                />
                <Divider></Divider>
                <ColorPicker value={getCategoryData(category).color} defaultValue="transparent" onChange={(color) => {
                    dispatch(setAdminCategoryValue({
                        category: category,
                        key: "color",
                        value: `${color.css.backgroundColor}`
                    }));
                }}/>
             {/*   <ColorPicker
                    defaultValue={"Select category color"}
                    name='color'
                    value={getCategoryData(category).color}
                    onChange={(color) => {
                        dispatch(setAdminCategoryValue({
                            category: category,
                            key: "color",
                            value: color
                        }));
                    }}

                />*/}
             {/*   <TextField
                    id="color"
                    label="Color"
                    fullWidth={true}
                    variant="filled"
                    value={getCategoryData(category).color}
                    onChange={(e) => {
                        dispatch(setAdminCategoryValue({
                            category: category,
                            key: "color",
                            value: e.target.value
                        }));
                    }}
                />*/}

                <UploadWidget usageFilter={"panel"} title={"Select Panel image"} setFunction={setPanel}
                              uuid={getCategoryData(category).image}></UploadWidget>

                <UploadWidget usageFilter={"iconMap"} title={"Select map icon"} setFunction={setIcon}
                              uuid={getCategoryData(category).mapIcon}></UploadWidget>

                <TextField
                    id="fields"
                    label="Field Config"
                    fullWidth={true}

                    defaultValue={"{}"}
                    variant="filled"
                    value={getCategoryData(category).fields}
                    onChange={(e) => {
                        dispatch(setAdminCategoryValue({
                            category: category,
                            key: "fields",
                            value: JSON.parse(e.target.value)
                        }));
                    }}
                />
                <Button onClick={(e) => {
                    setConfig(e);
                }}>Save</Button>

                <Button onClick={() => {
                    setCategory(undefined);
                }}>Cancel</Button>
            </>

        )
    } else {


        return (
            <Drawer
                anchor="right"
                open={open}
                variant="persistent"
                className={classes.adminDrawers}

            >
                <Box sx={{margin: "50px"}}>

                    <h1>Categories</h1>
                    <FormControl fullWidth>
                        <InputLabel id="category-label">Select category</InputLabel>
                        <Select
                            labelId="category-label"
                            id="category"
                            value={category}
                            label="Category"
                            fullWidth={true}

                            onChange={(e) => {
                                setCategory(e.target.value);
                            }}
                        >
                            {categories.map(value => (
                                <MenuItem value={value.key}>{value.key}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Drawer>
        )
    }
}