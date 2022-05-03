import React, {useRef} from 'react';

import {pages} from 'themeLocaria';
import {useStyles} from "stylesLocaria";


import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {closePageDialog} from "../../redux/slices/pageDialogSlice";
import Slide from "@mui/material/Slide";
import {closeViewDraw} from "../../redux/slices/viewDrawerSlice";
import {closeMultiSelect} from "../../redux/slices/multiSelectSlice";
import Button from "@mui/material/Button";
import {Drawer} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {openSearchDrawer} from "../../redux/slices/searchDrawerSlice";
import CloseIcon from "@mui/icons-material/Close";
import MDEditor from '@uiw/react-md-editor';
import Container from "@mui/material/Container";

import FAQ from "../faq";
import ContactForm from "../contactForm"
import ReactDOM from "react-dom";


const PageDrawer = () => {
    const classes = useStyles();
    const dispatch = useDispatch()
    const history = useHistory();


    const pagePlugins={
        "FAQ":<FAQ/>,
        "CONTACT":<ContactForm/>
    }

    const open = useSelector((state) => state.pageDialog.open);
    const page = useSelector((state) => state.pageDialog.page);
    const [pageData, setPageData] = React.useState(undefined);

    const isInitialMount = useRef(true);

    const getPageData = () => {
        window.websocket.send({
            "queue": "getPageData",
            "api": "api",
            "data": {
                "method": "get_parameters",
                "parameter_name": `page_${page}`
            }
        });
    }

    React.useEffect(() => {

        window.websocket.registerQueue('getPageData', (json) => {
            setPageData(json.packet[`page_${page}`]);
        });

        if (page) {
            getPageData();
        }
    }, [page]);

    React.useEffect(() => {
        if (open)
            history.push(`/Page/${page}`);

    }, [open]);

    React.useEffect(() => {
        if(document.getElementById('contact'))
            ReactDOM.render(<ContactForm/>, document.getElementById('contact'));
    });

    if (pageData) {
        return (
            <Drawer
                anchor="bottom"
                open={open}
                className={classes.pageDraw}
                variant="persistent"
            >
                <div className={classes.searchDrawHeader}>
                    <Typography className={classes.viewDrawTitle} variant={'h5'}>{pageData.title}</Typography>
                    <IconButton onClick={() => {
                        dispatch(closePageDialog());
                    }} className={classes.viewDrawClose} type="submit"
                                aria-label="search">
                        <CloseIcon className={classes.icons}/>
                    </IconButton>
                </div>
                <Container>
                    <MDEditor.Markdown source={pageData.data} className={classes.pageDrawMD}/>
                    {/*{pageData.plugin? pagePlugins[pageData.plugin]:<></>}*/}
                </Container>
            </Drawer>

        )
    } else {
        return <></>
    }
};


export default PageDrawer;