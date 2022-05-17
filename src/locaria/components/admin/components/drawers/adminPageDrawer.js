import React, {useRef, useState} from "react"

import {Drawer, InputLabel, Select, TextField} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {closeUploadDrawer} from "../../redux/slices/uploadDrawerSlice";
import {closeEditFeatureDrawer} from "../../redux/slices/editFeatureDrawerSlice";
import {setTitle} from "../../redux/slices/adminSlice";
import {useStyles} from "../../../../../theme/default/adminStyle";
import {useHistory} from "react-router-dom";
import Button from "@mui/material/Button";
import {addPage, setPages, setPage} from "../../redux/slices/adminPageDrawerSlice";
import {useCookies} from "react-cookie";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import MDEditor from '@uiw/react-md-editor';
import Container from "@mui/material/Container";
import {closeSystemConfigDrawer} from "../../redux/slices/systemConfigDrawerSlice";
import {closeDashboardDrawer} from "../../redux/slices/adminDashboardDrawerSlice";
import {closeAdminCategoryDrawer} from "../../redux/slices/adminCategoryDrawerSlice";
import {closeLanguageDrawer} from "../../redux/slices/adminLanguageDrawerSlice";


export default function AdminPageDrawer(props) {

    const open = useSelector((state) => state.adminPageDrawer.open);
    const pages = useSelector((state) => state.adminPageDrawer.pages);
    const page = useSelector((state) => state.adminPageDrawer.page);

    const [pageData, setPageData] = useState({});
    const dispatch = useDispatch()
    const classes = useStyles();
    const isInitialMount = useRef(true);
    const history = useHistory();

    const [cookies, setCookies] = useCookies(['location'])


    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        }

        window.websocket.registerQueue('getPages', (json) => {
            if (json.packet.systemPages)
                dispatch(setPages(json.packet.systemPages));
            else
                dispatch(setPages([]));
        });

        window.websocket.registerQueue('setPages', (json) => {
            getPages();
        });

        window.websocket.registerQueue('setPageData', (json) => {
            dispatch(setPage(undefined));
        });

        if (open) {
            history.push(`/Admin/Pages/`);
            dispatch(closeUploadDrawer());
            dispatch(closeEditFeatureDrawer());
            dispatch(closeSystemConfigDrawer());
            dispatch(closeDashboardDrawer());
            dispatch(closeAdminCategoryDrawer());
            dispatch(closeLanguageDrawer());

            dispatch(setTitle('System'));
            getPages();
        }

    }, [open]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        }

        window.websocket.registerQueue('getPageData', (json) => {
            if (json.packet[`page_${page}`])
                dispatch(setPageData(json.packet[`page_${page}`]));
            else
                dispatch(setPageData({data:"# New file",type:"Markdown",title:"My page title"}));
        });
        if (page !== undefined) {
            getPageData();
        }

    }, [page]);

    const getPages = () => {
        window.websocket.send({
            "queue": "getPages",
            "api": "sapi",
            "data": {
                "method": "get_parameters",
                "parameter_name": "systemPages",
                id_token: cookies['id_token'],

            }
        });
    }

    const getPageData = () => {
        window.websocket.send({
            "queue": "getPageData",
            "api": "sapi",
            "data": {
                "method": "get_parameters",
                "parameter_name": `page_${page}`,
                id_token: cookies['id_token'],

            }
        });
    }


    const setPagesApi = (e) => {
        window.websocket.send({
            "queue": "setPages",
            "api": "sapi",
            "data": {
                "method": "set_parameters",
                "acl": "external",
                "parameter_name": "systemPages",
                id_token: cookies['id_token'],
                "parameters": [...pages, ...[{
                    id: document.getElementById('pageId').value,
                    name: document.getElementById('pageName').value,
                    type: document.getElementById('pageType').value,
                }]]
            }
        });
        window.systemPages = pages;
    }




    const PageDetails = () => {
        const [data, setData] = useState(pageData.data);
        const [plugin, setPlugin] = useState(pageData.plugin);

        const setPageDataApi = (e) => {
            window.websocket.send({
                "queue": "setPageData",
                "api": "sapi",
                "data": {
                    "method": "set_parameters",
                    "acl": "external",
                    "parameter_name": `page_${page}`,
                    id_token: cookies['id_token'],
                    "parameters": {
                        "data": data,
                        "plugin": plugin
                    }
                }
            });
        }

        if(pageData&&page!==undefined) {
            if(pageData.type==='link') {

            } else {
                return (
                    <Container>
                        <MDEditor
                            id={"pageData"}
                            value={data}
                            onChange={setData}
                            height={500}

                        />
                        <Select
                            labelId="pagePluginLabel"
                            id="pagePlugin"
                            label="Plugin"
                            fullWidth
                            margin={"dense"}
                            value={plugin}
                            onChange={(e)=>{
                                setPlugin(e.target.value);
                            }}
                        >
                            <MenuItem value={"FAQ"}>FAQS</MenuItem>
                            <MenuItem value={"CONTACT"}>Contact form</MenuItem>
                        </Select>
                        <Button onClick={setPageDataApi}>Save</Button>
                        <Button onClick={()=>{
                            dispatch(setPage(undefined));
                        }}>Cancel</Button>
                        <Button color={"warning"}>Delete</Button>
                    </Container>
                )
            }
        } else {
            return (
                <></>
            )
        }
    }


    return (
        <Drawer
            anchor="right"
            open={open}
            variant="persistent"
            className={classes.adminDrawers}

        >
            {pages&&!page ? (
                <Container>
                        <h2>Add Page</h2>
                        <TextField
                            id="pageId"
                            label="Page Id"
                            variant="filled"
                            defaultValue={"My New Page"}
                            fullWidth
                            margin={"dense"}
                        />
                        <TextField
                            id="pageName"
                            label="Page Name"
                            variant="filled"
                            defaultValue={"My page title"}
                            fullWidth
                            margin={"dense"}

                        />
                        <InputLabel id="pageTypeLabel">Page Type</InputLabel>
                        <Select
                            labelId="pageTypeLabel"
                            id="pageType"
                            label="Page"
                            fullWidth
                            margin={"dense"}

                        >
                            <MenuItem value={"Markdown"}>Markdown</MenuItem>
                            <MenuItem value={"Link"}>Link</MenuItem>
                        </Select>
                        <Button variant={"outlined"} onClick={() => {
                            setPagesApi();
                        }}>Add Page</Button>

                        <h2>Edit Page</h2>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Edit Page</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={page}
                                label="Page"
                                onChange={(e) => {
                                    dispatch(setPage(e.target.value));
                                }}
                            >
                                {pages.map((page) => {
                                    return (
                                        <MenuItem key={page.id} value={page.id}>{page.id} - {page.name}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                </Container>) : (<></>)}
            <PageDetails></PageDetails>

        </Drawer>
    )
}