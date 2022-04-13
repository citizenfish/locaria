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
import {addPage, setPages} from "../../redux/slices/adminPageDrawerSlice";
import {useCookies} from "react-cookie";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import {setPage} from "../../../redux/slices/searchDrawerSlice";
import Divider from "@mui/material/Divider";
import MDEditor from '@uiw/react-md-editor';



export default function AdminPageDrawer(props) {

    const open = useSelector((state) => state.adminPageDrawer.open);
    const pages = useSelector((state) => state.adminPageDrawer.pages);
    const page = useSelector((state) => state.adminPageDrawer.page);

    const [pageData,setPageData] = useState(undefined);
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

        if (open) {
            history.push(`/Admin/Pages/`);
            dispatch(closeUploadDrawer())
            dispatch(closeEditFeatureDrawer())
            dispatch(setTitle('System'));
            getPages();
        }

    }, [open]);

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


    const setPagesApi = (e) => {
        window.websocket.send({
            "queue": "setPages",
            "api": "sapi",
            "data": {
                "method": "set_parameters",
                "acl": "external",
                "parameter_name": "systemPages",
                id_token: cookies['id_token'],
                "parameters": [...pages,document.getElementById('pageName').value]
            }
        });
        window.systemPages = pages;
    }


    return (
        <Drawer
            anchor="right"
            open={open}
            variant="persistent"
            className={classes.adminDrawers}

        >
            <h1>Pages</h1>
            {pages ? (
                <>
                    <TextField
                        id="pageName"
                        label="Page Name"
                        variant="filled"
                        defaultValue={"My New Page"}
                    />
                    <Button onClick={()=>{
                        setPagesApi();
                    }}>Add Page</Button>
                    <Divider></Divider>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Age</InputLabel>
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
                                    <MenuItem key={page} value={page}>{page}</MenuItem>

                                )
                            })}
                        </Select>
                    </FormControl>
                    <Divider></Divider>
                    <MDEditor
                        value={pageData}
                        onChange={setPageData}
                    />
                    <MDEditor.Markdown source={pageData} />
                </>) : (<></>)}
        </Drawer>
    )
}