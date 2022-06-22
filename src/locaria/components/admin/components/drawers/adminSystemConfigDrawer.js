import React, {useRef, useState} from "react"

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import {
    Alert,
    Checkbox,
    Drawer,
    FormControlLabel,
    FormGroup,
    InputLabel,
    Select,
    Snackbar,
    TextField
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {closeUploadDrawer} from "../../redux/slices/uploadDrawerSlice";
import {closeEditFeatureDrawer} from "../../redux/slices/editFeatureDrawerSlice";
import {setTitle} from "../../redux/slices/adminSlice";
import {useStyles} from "../../../../../theme/default/adminStyle";
import {useHistory} from "react-router-dom";
import Button from "@mui/material/Button";
import {setSystemConfig, setSystemConfigValue} from "../../redux/slices/systemConfigDrawerSlice";
import {useCookies} from "react-cookie";
import Slider from "@mui/material/Slider";
import {closeAdminPageDrawer} from "../../redux/slices/adminPageDrawerSlice";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import {closeDashboardDrawer} from "../../redux/slices/adminDashboardDrawerSlice";
import {closeAdminCategoryDrawer, setAdminCategoryValue} from "../../redux/slices/adminCategoryDrawerSlice";
import {closeLanguageDrawer} from "../../redux/slices/adminLanguageDrawerSlice";
import UploadWidget from "../../../widgets/data/uploadWidget";
import Container from "@mui/material/Container";
import {ColorPicker} from "mui-color";

import FontSelector from "../forms/fontSelector";
import Divider from "@mui/material/Divider";

export default function AdminSystemConfigDrawer(props) {
    const open = useSelector((state) => state.systemConfigDrawer.open);
    const config = useSelector((state) => state.systemConfigDrawer.config);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const dispatch = useDispatch()
    const classes = useStyles();
    const isInitialMount = useRef(true);
    const history = useHistory();
    const [tabc,setTabc] = useState('Layout')

    const [cookies, setCookies] = useCookies(['location'])

    const tabChange = (e, s) => {
        setTabc(s)
    }

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        }

        window.websocket.registerQueue('getConfig', (json) => {
            if(json.packet.parameters.systemMain)
                dispatch(setSystemConfig(json.packet.parameters.systemMain));
            else
                dispatch(setSystemConfig({}));
        });

        window.websocket.registerQueue('setConfig', (json) => {
            getConfig();
        });

        if (open) {
            history.push(`/Admin/System/`);
            dispatch(closeUploadDrawer());
            dispatch(closeEditFeatureDrawer());
            dispatch(closeAdminPageDrawer());
            dispatch(closeDashboardDrawer());
            dispatch(closeAdminCategoryDrawer());
            dispatch(closeLanguageDrawer());

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
                "acl": {},
                "method": "set_parameters",
                "parameter_name": "systemMain",
                id_token: cookies['id_token'],
                "usage":"Config",
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
            sx={{
                '.MuiDrawer-paper': {
                    borderLeft: 'none',
                },
            }}
        >
            {config ? (
                <Container sx={{
                    margin: 0,
                    maxWidth: 'unset !important',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingLeft: '0 !important',
                    paddingRight: '0 !important',
                }}>
                    <Box sx = {{width: '100%'}}>
                        <Tabs value = {tabc}
                              onChange = {tabChange}
                              >
                            <Tab value="Layout" label="Layout" />
                            <Tab value="Look and Feel" label="Look and Feel" />
                            <Tab value="Search" label="Search" />
                            <Tab value="Results" label="Results" />
                            <Tab value="Maps" label="Maps" />

                        </Tabs>
                    </Box>

                    { tabc === 'Layout' && <div
                        value="Layout"
                        style={{
                            paddingTop: 16,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            width: '100%',
                            maxWidth: 1200,
                        }}
                    >
                        <Box sx={{
                            display: 'grid',
                            columnGap: 2,
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            width: '100%',
                        }}>
                            <FormControl>
                                <InputLabel id="layoutTypeLabel">Layout type</InputLabel>
                                <Select
                                    labelId="layoutTypeLabel"
                                    id="layoutType"
                                    value={config.layoutType}
                                    label="Layout type"
                                    onChange={(e)=>{
                                        setUnsavedChanges(true);
                                        dispatch(setSystemConfigValue({key:"layoutType",value:e.target.value}));
                                    }}
                                >
                                    <MenuItem value={"App"}>App</MenuItem>
                                    <MenuItem value={"Pages"}>Pages</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl>
                                <InputLabel id="landingRouteLabel">Landing Page</InputLabel>
                                <Select
                                    labelId="landingRouteLabel"
                                    id="landingRoute"
                                    value={config.landingRoute}
                                    label="Landing page"
                                    onChange={(e)=>{
                                        setUnsavedChanges(true);
                                        dispatch(setSystemConfigValue({key:"landingRoute",value:e.target.value}));
                                    }}
                                >
                                    <MenuItem value={"/"}>Landing</MenuItem>
                                    <MenuItem value={"/Home"}>Home</MenuItem>
                                    <MenuItem value={"/Map"}>Map</MenuItem>
                                    <MenuItem value={"/Search"}>Search</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl>
                                <InputLabel id="navTypeLabel">Navigation type</InputLabel>
                                <Select
                                    labelId="navTypeLabel"
                                    id="landingRoute"
                                    value={config.navType}
                                    label="Landing page"
                                    onChange={(e)=>{
                                        setUnsavedChanges(true);
                                        dispatch(setSystemConfigValue({key:"navType",value:e.target.value}));
                                    }}
                                >
                                    <MenuItem value={"Full"}>Full Nav</MenuItem>
                                    <MenuItem value={"Simple"}>Simple</MenuItem>

                                </Select>
                            </FormControl>
                        </Box>

                        <Divider sx={{width: '100%', marginTop: 2, marginBottom: 2}} />

                        <Box sx={{
                            display: 'flex',
                        }}>
                            <FontSelector sx={{padding: 0}} detail={"Header Background color"} name={"headerBackground"}/>
                            <FontSelector sx={{padding: 0, marginLeft: 2}} detail={"Panel Background color"} name={"themePanels"}/>
                        </Box>

                        <Divider sx={{width: '100%', marginTop: 2, marginBottom: 2}} />

                        <Box sx={{
                            display: 'grid',
                            columnGap: 2,
                            rowGap: 1,
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            width: '100%',
                        }}>
                            <div className={"colour-picker-container"}>
                                <InputLabel id="fontMainLabel">Primary font color</InputLabel>
                                <ColorPicker
                                    value={config.fontMain}
                                    defaultValue="transparent"
                                    onChange={(color) => {
                                        setUnsavedChanges(true);
                                        dispatch(setSystemConfigValue({key:"fontMain",value:color.css.backgroundColor}));
                                    }}
                                />
                            </div>

                            <div className={"colour-picker-container"}>
                                <InputLabel id="fontSecondaryLabel">Secondary font color</InputLabel>
                                <ColorPicker
                                    value={config.fontSecondary}
                                    defaultValue="transparent"
                                    onChange={(color) => {
                                        setUnsavedChanges(true);
                                        dispatch(setSystemConfigValue({key:"fontSecondary",value:color.css.backgroundColor}));
                                    }}
                                />
                            </div>

                            <div className={"colour-picker-container"}>
                                <InputLabel id="fontH1Label">H1 font color</InputLabel>
                                <ColorPicker
                                    value={config.fontH1}
                                    defaultValue="transparent"
                                    onChange={(color) => {
                                        setUnsavedChanges(true);
                                        dispatch(setSystemConfigValue({key:"fontH1",value:color.css.backgroundColor}));
                                    }}
                                />
                            </div>

                            <div className={"colour-picker-container"}>
                                <InputLabel id="fontH2Label">H2 font color</InputLabel>
                                <ColorPicker
                                    value={config.fontH2}
                                    defaultValue="transparent"
                                    onChange={(color) => {
                                        setUnsavedChanges(true);
                                        dispatch(setSystemConfigValue({key:"fontH2",value:color.css.backgroundColor}));
                                    }}
                                />
                            </div>

                            <div className={"colour-picker-container"}>
                                <InputLabel id="fontH3Label">H3 font color</InputLabel>
                                <ColorPicker
                                    value={config.fontH3}
                                    defaultValue="transparent"
                                    onChange={(color) => {
                                        setUnsavedChanges(true);
                                        dispatch(setSystemConfigValue({key:"fontH3",value:color.css.backgroundColor}));
                                    }}
                                />
                            </div>

                            <div className={"colour-picker-container"}>
                                <InputLabel id="fontPLabel">P font color</InputLabel>
                                <ColorPicker
                                    value={config.fontP}
                                    defaultValue="transparent"
                                    onChange={(color) => {
                                        setUnsavedChanges(true);
                                        dispatch(setSystemConfigValue({key:"fontP",value:color.css.backgroundColor}));
                                    }}
                                />
                            </div>
                        </Box>

                        <Divider sx={{width: '100%', marginTop: 1, marginBottom: 2}} />

                        <UploadWidget
                            usageFilter={"gallery"}
                            title={"Select gallery image(s)"}
                            setFunction={(uuid)=>{
                                setUnsavedChanges(true);
                                dispatch(setSystemConfigValue({key:"galleryImage",value:uuid}));
                            }}
                            uuid={config.galleryImage}
                            sx={{
                                width: '100%',
                            }}
                        />
                    </div> }

                    {tabc === 'Look and Feel' && <div
                      style={{
                          paddingTop: 16,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          width: '100%',
                          maxWidth: 1200,
                      }}
                    >
                        <UploadWidget
                            usageFilter={"logo"}
                            title={"Select site logo"}
                            setFunction={(uuid)=>{
                                setUnsavedChanges(true);
                                dispatch(setSystemConfigValue({key:"siteLogo",value:uuid}));
                            }}
                            uuid={config.siteLogo}
                            sx={{
                                width: '100%',
                            }}
                        />

                        <Divider sx={{width: '100%', marginTop: 1, marginBottom: 2}} />

                        <UploadWidget
                            usageFilter={"logo"}
                            title={"Select footer image"}
                            setFunction={(uuid)=>{
                                setUnsavedChanges(true);
                                dispatch(setSystemConfigValue({key:"siteFooter",value:uuid}));
                            }}
                            uuid={config.siteFooter}
                            sx={{
                                width: '100%',
                            }}
                        />

                        <Divider sx={{width: '100%', marginTop: 1, marginBottom: 2}} />

                        <UploadWidget
                            usageFilter={"iconMap"}
                            title={"Select default map icon"}
                            setFunction={(uuid)=>{
                                setUnsavedChanges(true);
                                dispatch(setSystemConfigValue({key:"defaultMapIcon",value:uuid}));
                            }}
                            uuid={config.defaultMapIcon}
                            sx={{
                                width: '100%',
                            }}
                        />
                    </div>}

                    {tabc === 'Search' && <div
                      style={{
                          paddingTop: 16,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          width: '100%',
                          maxWidth: 1200,
                      }}
                    >
                        <TextField
                            id="searchLimit"
                            label="Search limit"
                            defaultValue={40}
                            variant="filled"
                            value={config.searchLimit}
                            onChange={(e)=>{
                                setUnsavedChanges(true);
                                dispatch(setSystemConfigValue({key:"searchLimit",value:parseInt(e.target.value)}));
                            }}

                        />
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox defaultChecked checked={config.searchDistance}/>}
                                label="Distance Enabled"
                                onChange={(e)=>{
                                    setUnsavedChanges(true);
                                    dispatch(setSystemConfigValue({key:"searchDistance",value:e.target.checked}));
                                }}
                            />
                            <FormControlLabel
                                control={<Checkbox defaultChecked checked={config.searchLocation}/>}
                                label="Location Enabled"
                                onChange={(e)=>{
                                    setUnsavedChanges(true);
                                    dispatch(setSystemConfigValue({key:"searchLocation",value:e.target.checked}));
                                }}
                            />
                            <FormControlLabel
                                control={<Checkbox defaultChecked  checked={config.searchTags}/>}
                                label="Tags Enabled"
                                onChange={(e)=>{
                                    setUnsavedChanges(true);
                                    dispatch(setSystemConfigValue({key:"searchTags",value:e.target.checked}));
                                }}
                            />
                            <FormControlLabel
                                control={<Checkbox defaultChecked checked={config.searchCategory}/>}
                                label="Category Enabled"
                                onChange={(e)=>{
                                    setUnsavedChanges(true);
                                    dispatch(setSystemConfigValue({key:"searchCategory",value:e.target.checked}));
                                }}
                            />
                        </FormGroup>
                    </div>}

                    {tabc === 'Results' && <div>
                        <FormControl fullWidth>
                            <InputLabel id="viewMode-label">View mode</InputLabel>
                            <Select
                                labelId="viewMode-label"
                                id="viewMode"
                                value={config.viewMode}
                                label="View Mode"
                                onChange={(e)=>{
                                    setUnsavedChanges(true);
                                    dispatch(setSystemConfigValue({key:"viewMode",value:e.target.value}));
                                }}
                            >
                                <MenuItem value={"Full"}>Full screen (with Map)</MenuItem>
                                <MenuItem value={"FullDetails"}>Full screen details</MenuItem>
                                <MenuItem value={"Left"}>Left draw (App Mode only)</MenuItem>

                            </Select>
                        </FormControl>
                    </div>}

                    {tabc === 'Maps' && <div>

                        <TextField
                            id="mapXYZ"
                            label="mapXYZ URL"
                            defaultValue={"https://api.os.uk/maps/raster/v1/zxy/Road_3857/{z}/{x}/{y}.png?key=w69znUGxB6IW5FXkFMH5LQovdZxZP7jv"}
                            variant="filled"
                            value={config.mapXYZ}
                            onChange={(e)=>{
                                setUnsavedChanges(true);
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
                                setUnsavedChanges(true);
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
                                setUnsavedChanges(true);
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
                                setUnsavedChanges(true);
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
                                setUnsavedChanges(true);
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
                                setUnsavedChanges(true);
                                dispatch(setSystemConfigValue({key:"clusterWidthMod",value:parseInt(e.target.value)}));
                            }}
                        />
                        <FormControl fullWidth>
                            <InputLabel id="clusterAlgorithm-label">Age</InputLabel>
                            <Select
                                labelId="clusterAlgorithm-label"
                                id="clusterAlgorithm"
                                value={config.clusterAlgorithm}
                                label="Age"
                                onChange={(e)=>{
                                    setUnsavedChanges(true);
                                    dispatch(setSystemConfigValue({key:"clusterAlgorithm",value:e.target.value}));
                                }}
                            >
                                <MenuItem value={"DBSCAN"}>DBSCAN</MenuItem>
                                <MenuItem value={"KMEANSDBSCAN"}>KMEANSDBSCAN</MenuItem>
                                <MenuItem value={"KMEANS"}>KMEANS</MenuItem>
                            </Select>
                        </FormControl>
                    </div>}

                    <Snackbar
                        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                        open={unsavedChanges}
                    >
                      <Alert
                        severity={"warning"}
                        sx={{
                            width: '100%',
                            alignItems: 'center',
                        }}
                      >
                        You have unsaved changes
                          <Button
                            variant={"contained"}
                            size={"small"}
                            sx={{
                                marginLeft: 2,
                            }}
                            onClick={(e) => {
                                setUnsavedChanges(false);
                                setConfig(e);
                            }}
                          >
                              Save
                          </Button>
                      </Alert>
                    </Snackbar>
                </Container>) : null
            }

        </Drawer>
    )
}

