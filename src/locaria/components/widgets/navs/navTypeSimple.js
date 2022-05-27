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
            marginRight: "10px"
        }}>
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