import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const NavTypeSimple = function () {


    return (
        <Box sx={{
            marginBottom: "20px"
        }}>
            <Grid container justifyContent="center" spacing={0.5} sx={{
                verticalAlign: "middle",
                width: "calc(100vw - 20px)",
                zIndex: '150',
                padding: '5px 0 !important',
                backgroundColor: window.systemMain.headerBackground,
                marginLeft: "10px",
                marginRight: "10px",
                marginTop: "5px",
            }}>
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
                <Grid item md={6} sx={{
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