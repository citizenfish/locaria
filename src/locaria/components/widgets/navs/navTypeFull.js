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
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

const NavTypeFull = function () {
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
        <Box className={classes['navTypeFull']} sx={{width: "100vw",height:64}}>
            <Grid container>
                <Grid item xs={1}>
                    <IconButton  sx={{margin: "0 auto", display: "flex"}}
                            onClick={() => {
                                dispatch(openMenuDraw());
                            }}>
                        <MenuIcon color="icons" fontSize="large"/>
                    </IconButton>
                </Grid>
                <Grid item xs={10}>
                    <Grid container sx={{
                        borderLeft: "2px solid white",
                        borderRight: "2px solid white"
                    }}>
                        <Grid item xs={12}>
                            <Typography sx={{
                                flexGrow: 1,
                                textAlign: "center"
                            }} variant="h6">
                                {window.systemLang.siteTitle ? window.systemLang.siteTitle.toUpperCase() : 'Locaria'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={{
                                flexGrow: 1,
                                textAlign: "center"
                            }} variant="body2">
                                {window.systemLang.siteSubTitle}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={1}>
                    <IconButton  sx={{margin: "0 auto", display: "flex"}}
                            onClick={() => {
                                toggleSearchWrapper()
                            }}>
                        <SearchIcon color="icons" fontSize="large"/>
                    </IconButton >
                </Grid>
            </Grid>
        </Box>
    )
}

export default NavTypeFull;