import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const NavTypeSimple = function () {


    return (
        <Box sx={{
            width: "calc(100vw - 20px)",
            zIndex: '150',
            justifyContent: 'space-between !important',
            padding: '5px 0 !important',
            backgroundColor: window.systemMain.headerBackground,
            marginLeft: "10px",
            marginRight: "10px",
            marginTop: "5px",

        }}>
            <Grid container sx={{
                verticalAlign: "middle"

            }}>
                <Grid item md={6}>
                    <Typography variant="h1" sx={{
                        flexGrow: 1,
                        textAlign: "center",
                        fontSize: "1.5rem"
                    }}>
                        {window.systemLang.siteTitle ? window.systemLang.siteTitle.toUpperCase() : 'Locaria'}
                    </Typography>
                </Grid>
                <Grid item md={6} sx={{
                    display: {
                        md: "block",
                        xs: "none"
                    }
                }}>
                    <Typography variant="h1" sx={{
                        flexGrow: 1,
                        textAlign: "center",
                        fontSize: "1rem",

                    }}>
                        {window.systemLang.siteSubTitle}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    )
}

export default NavTypeSimple;