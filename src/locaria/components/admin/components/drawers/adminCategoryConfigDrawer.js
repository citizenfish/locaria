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
import UploadWidget from "../../../widgets/data/uploadWidget";
import Channels from "../../../../libs/Channels";
import {ColorPicker} from 'mui-color';
import Divider from "@mui/material/Divider";


export default function AdminCategoryConfigDrawer(props) {

    const open = useSelector((state) => state.adminCategoryDrawer.open);
    const categories = useSelector((state) => state.adminCategoryDrawer.categories);

    const dispatch = useDispatch()
    const classes = useStyles();
    const isInitialMount = useRef(true);
    const history = useHistory();

    const [cookies, setCookies] = useCookies(['location']);

    const [category, setCategory] = useState(undefined);


    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        }

        window.websocket.registerQueue('getCategories', (json) => {
            if (json.packet.categories)
                dispatch(setAdminCategories({
                    data: json.packet.categories, defaults: {
                        "name": "My category",
                        "description": "My description",
                        "display": true
                    }
                }));
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
                "attributes": "true"
            }
        });
    }

    const getCategoryData = () => {
        for (let cat in categories) {
            if (categories[cat].key === category)
                return categories[cat];
        }
    }

    const setPanel = (uuid) => {
        dispatch(setAdminCategoryValue({category: category, key: "image", value: uuid}));

    }

    const setIcon = (uuid) => {
        dispatch(setAdminCategoryValue({category: category, key: "mapIcon", value: uuid}));

    }

    const setConfig = (e) => {

        let data = JSON.parse(JSON.stringify(getCategoryData()));
        data.fields=JSON.parse(data.fields);
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
        window.systemCategories = new Channels(categories);

        setCategory(undefined);

    }

    if (category) {
        return (
            <div style={{zIndex: 0}}>
                <h1 style={{color: 'black'}}>{category}</h1>
                <TextField
                    id="name"
                    label="Name"
                    fullWidth={true}
                    variant="outlined"
                    value={getCategoryData(category).name}
                    onChange={(e) => {
                        dispatch(setAdminCategoryValue({
                            category: category,
                            key: "name",
                            value: e.target.value
                        }));
                    }}
                    sx={{
                        marginBottom: 1,
                    }}
                />
                <TextField
                    id="description"
                    label="Description"
                    fullWidth={true}
                    variant="outlined"
                    value={getCategoryData(category).description}
                    onChange={(e) => {
                        dispatch(setAdminCategoryValue({
                            category: category,
                            key: "description",
                            value: e.target.value
                        }));
                    }}
                    sx={{
                        marginBottom: 1,
                    }}
                />

                <div style={{width: 250, marginBottom: 16,}} className={"colour-picker-container"}>
                    <ColorPicker
                        value={getCategoryData(category).color}
                        defaultValue="transparent"
                        onChange={(color) => {
                            dispatch(setAdminCategoryValue({
                                category: category,
                                key: "color",
                                value: `${color.css.backgroundColor}`
                            }));
                        }}
                    />
                </div>

                <FormGroup style={{color: 'black'}}>
                    <FormControlLabel
                      control={<Checkbox checked={getCategoryData(category).display}/>}
                      label="Display in search"
                      onChange={(e) => {
                          dispatch(setAdminCategoryValue({
                              category: category,
                              key: "display",
                              value: e.target.checked
                          }));
                      }}
                    />
                </FormGroup>

                <Divider sx={{marginTop: 1, marginBottom: 2,}} />

                <UploadWidget
                    usageFilter={"panel"}
                    title={"Select Panel image"}
                    setFunction={setPanel}
                    uuid={getCategoryData(category).image}
                />
                <div style={{marginTop: 16}} />
                <UploadWidget
                    usageFilter={"iconMap"}
                    title={"Select map icon"}
                    setFunction={setIcon}
                    uuid={getCategoryData(category).mapIcon}
                />

                <Divider sx={{marginTop: 2, marginBottom: 1,}} />

                <TextField
                    multiline
                    rows={6}
                    id="fields"
                    label="Field Config"
                    fullWidth={true}
                    defaultValue={"{}"}
                    variant="outlined"
                    value={getCategoryData(category).fields}
                    onChange={(e) => {
                        dispatch(setAdminCategoryValue({
                            category: category,
                            key: "fields",
                            value: e.target.value
                        }));
                    }}
                    sx={{
                        marginTop: 2,
                        marginBottom: 1,
                    }}
                />

                <Divider sx={{marginTop: 1, marginBottom: 3,}} />

                <Button
                    variant={"contained"}
                    onClick={(e) => {
                        setConfig(e);
                    }}
                >
                    Save
                </Button>

                <Button
                    variant={"contained"}
                    onClick={() => {
                        setCategory(undefined);
                    }}
                    sx={{
                        marginLeft: 1,
                    }}
                >
                    Cancel
                </Button>
            </div>

        )
    } else {
        return (
            <Drawer
                anchor="right"
                open={open}
                variant="persistent"
                className={classes.adminDrawers}
                sx={{
                  '.MuiDrawer-paper': {
                    borderLeft: 'none',
                    zIndex: 2,
                  },
                }}
            >
                <Box sx={{margin: "0 50px"}}>
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