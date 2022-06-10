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
            if (json.packet)
                dispatch(setPages(json.packet.parameters));
            else
                dispatch(setPages({}));
        });

        window.websocket.registerQueue('addPage', (json) => {
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
            if (json.packet.parameters[page])
                dispatch(setPageData(json.packet.parameters[page]));
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
                "usage": "Page",
                "delete_key":"data",
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
                "parameter_name": page,
                id_token: cookies['id_token'],

            }
        });
    }

    const addPage = () => {
        window.websocket.send({
            "queue": "addPage",
            "api": "sapi",
            "data": {
                "method": "set_parameters",
                "acl": "external",
                "parameter_name": document.getElementById('pageId').value,
                id_token: cookies['id_token'],
                "usage":"Page",
                "parameters": {
                    "data":"new page data",
                    "title":document.getElementById('pageName').value
                }
            }
        });
    }


  /*  const setPagesApi = (e) => {
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
*/



    const PageDetails = () => {
        const [data, setData] = useState(pageData.data);
        const [title, setTitle] = useState(pageData.title);
        const [plugin, setPlugin] = useState(pageData.plugin);

        const setPageDataApi = (e) => {
            window.websocket.send({
                "queue": "setPageData",
                "api": "sapi",
                "data": {
                    "method": "set_parameters",
                    "acl": "external",
                    "parameter_name": page,
                    id_token: cookies['id_token'],
                    "usage":"Page",
                    "parameters": {
                        "data": data,
                        "title": title
                    }
                }
            });
        }

        if(pageData&&page!==undefined) {
            if(pageData.type==='link') {

            } else {
                return (
                    <Container>
                        <TextField
                            id="pageName"
                            label="Page Name"
                            variant="filled"
                            defaultValue={"My page title"}
                            fullWidth
                            margin={"dense"}
                            value={title}
                            onChange={(e)=>{setTitle(e.target.value)}}

                        />
                        <MDEditor
                            id={"pageData"}
                            value={data}
                            onChange={setData}
                            height={500}

                        />
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

    let pageList=[];
    for(let p in pages) {
        pageList.push( <MenuItem key={p} value={p}>{p} - {pages[p].title}</MenuItem>)
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
                        <Button variant={"outlined"} onClick={() => {
                            addPage();
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
                                {pageList}
                            </Select>
                        </FormControl>
                </Container>) : (<></>)}
            <PageDetails></PageDetails>

        </Drawer>
    )
}