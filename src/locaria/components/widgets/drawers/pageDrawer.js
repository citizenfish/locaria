import React, {useRef} from 'react';

import {useStyles} from "stylesLocaria";


import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {closePageDialog} from "../../redux/slices/pageDialogSlice";

import {Drawer} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Container from "@mui/material/Container";

import FAQ from "../faq";
import ReactDOM from "react-dom";
import RenderMarkdown from "../markdown/renderMarkdown";


const PageDrawer = ({mode,page}) => {
    const classes = useStyles();
    const dispatch = useDispatch()
    const history = useHistory();


    const pagePlugins={
        "FAQ":<FAQ/>
    }

    const open = useSelector((state) => state.pageDialog.open);
  //  const page = useSelector((state) => state.pageDialog.page);
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


     const Content=() => {
         return (
             <>
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
                     <RenderMarkdown markdown={pageData.data}/>
                     {/*<MDEditor.Markdown source={pageData.data} className={classes.pageDrawMD}/>*/}
                     {/*{pageData.plugin? pagePlugins[pageData.plugin]:<></>}*/}
                 </Container>
             </>
         )
    }



    if (pageData) {
        if(mode==='page') {
            return <Content/>
        } else {
        return (
            <Drawer
                anchor="bottom"
                open={open}
                className={classes.pageDraw}
                variant="persistent"
            >
                <Content/>
            </Drawer>

        )
        }
    } else {
        return <></>
    }
};






export default PageDrawer;