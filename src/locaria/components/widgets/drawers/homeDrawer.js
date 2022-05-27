import React, {useRef} from "react";


import {Drawer} from "@mui/material";
import {useSelector} from "react-redux";
import {useStyles} from "stylesLocaria";
import PageList from "../pages/pageList";
import Divider from "@mui/material/Divider";
import LogoStrapLine from "../logos/logoStrapLine";
import ContactFull from "../contact/contactFull";
import TopFeatures from "../search/topFeatures";

const HomeDrawer = function (props) {

    const open = useSelector((state) => state.homeDrawer.open);
    const classes = useStyles();


    const Content= () => {
        return (
            <>
                <TopFeatures category={"News & Events"} limit={4}></TopFeatures>
                <Divider/>
                <PageList/>
                <Divider/>
                <ContactFull/>
            </>
        )
    }

    if(props.mode==='page') {
        return (<Content/>)
    } else {
        return (
            <Drawer
                anchor="bottom"
                open={open}
                className={classes.homeDrawer}
                variant="persistent"
            >
                <Content/>
            </Drawer>
        )
    }
}

export default HomeDrawer;
