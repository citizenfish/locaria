import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const footerTypeSimple = function () {


    return (
        <Box sx={{
            width: "calc(100vw - 20px)",
            justifyContent: 'space-between',
            padding: '5px 0',
            backgroundColor: window.systemMain.headerBackground,
            marginLeft: "10px",
            marginRight: "10px",
            marginTop: "10px"
        }}>
            <Grid container>
                <Grid item xs={12} sx={{
                    textAlign: "left"
                }}>
                    <Typography variant="p" sx={{
                        flexGrow: 1,
                        fontSize: "0.8rem",
                        paddingLeft: "10px"
                    }}>
                        {window.systemLang.siteFooter}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    )
}

export default footerTypeSimple;