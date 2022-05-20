import React from "react";
import {BottomNavigation, BottomNavigationAction} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {openMenuDraw} from "../../redux/slices/menuDrawerSlice";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";

import {useStyles} from "stylesLocaria";
import {useDispatch, useSelector} from "react-redux";
import {openLayout} from "../../redux/slices/layoutSlice";
import {openSearchDrawer} from "../../redux/slices/searchDrawerSlice";
import Box from "@mui/material/Box";

const NavTypeSimple = function () {
    const classes = useStyles();
    const dispatch = useDispatch()
    const searchDrawOpen = useSelector((state) => state.searchDraw.open);

    const toggleSearchWrapper = function () {
        if (searchDrawOpen === true) {
            //dispatch(closeSearchDrawer());
            dispatch(openLayout());
        } else {
            dispatch(openSearchDrawer());

        }
    }

    return (
        <Box className={classes.navTypeSimple} sx={{width: "100vw", height: 64}}>
            <Grid container>
                <Grid item xs={6}>
                    <Typography variant="h4" sx={{
                        flexGrow: 1,
                        textAlign: "center"
                    }}>
                        {window.systemLang.siteTitle ? window.systemLang.siteTitle.toUpperCase() : 'Locaria'}:
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h5" sx={{
                        flexGrow: 1,
                        textAlign: "center"
                    }}>
                        {window.systemLang.siteSubTitle}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    )
}

export default NavTypeSimple;