import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import BurgerMenu from "./burgerMenu";

const NavTypeSimple = function ({menu}) {



    return (
        <Box key={"navTypeSimple"} sx={{
            marginBottom: "20px"
        }}>
            <Grid container justifyContent="left" spacing={0.5} sx={{
                verticalAlign: "middle",
                width: "calc(100vw - 20px)",
                zIndex: '150',
                padding: '5px 0 !important',
                backgroundColor: window.systemMain.headerBackground,
                marginTop: "5px",
            }}>
                <Grid item md={1} sx={{
                    textAlign: "left",
                    verticalAlign: "middle",

                }}>
                    <BurgerMenu></BurgerMenu>

                </Grid>
                <Grid item md={6} sx={{
                    textAlign: "right",
                    verticalAlign: "middle",

                }}>

                    <Typography variant="h1" sx={{
                        flexGrow: 1,
                        fontSize: "1.5rem",
                        display: "inline-block",
                        fontFamily: window.systemMain.headerBackgroundFont
                    }}>
                        {window.systemLang.siteTitle ? window.systemLang.siteTitle.toUpperCase() : 'Locaria'}
                    </Typography>
                </Grid>
                <Grid item md={5} sx={{
                    display: {
                        md: "block",
                        xs: "none"
                    },
                    verticalAlign: "middle",

                }}>
                    <Typography variant="h1" sx={{
                        flexGrow: 1,
                        fontSize: "1rem",
                        display: "inline-block",
                        marginLeft: "10px"
                    }}>
                        {window.systemLang.siteSubTitle}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    )
}

export default NavTypeSimple;