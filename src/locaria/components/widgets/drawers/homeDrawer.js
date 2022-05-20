import React, {useRef} from "react";


import {Drawer} from "@mui/material";
import {useSelector} from "react-redux";
import {useStyles} from "stylesLocaria";

const HomeDrawer = function () {

    const open = useSelector((state) => state.homeDrawer.open);
    const classes = useStyles();

    return (
        <Drawer
            anchor="bottom"
            open={open}
            className={classes.homeDrawer}
            variant="persistent"
        >
            <h1>HOME</h1>
        </Drawer>
    )
}

export default HomeDrawer;
