import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const FooterTypeSimple = function () {


    return (
        <Box sx={{
            width: "100%",
            justifyContent: 'space-between',
            backgroundColor: window.systemMain.headerBackground,
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

export default FooterTypeSimple;