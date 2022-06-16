import React from 'react';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import UrlCoder from "../../../libs/urlCoder";
const url=new UrlCoder();


const LogoStrapLine = () => {

    return (
        <Box sx={{
            width: "calc(100vw - 20px)",
        }}>
            <Grid container>
                <Grid item xs={2} sx={{
                    textAlign: 'center'
                }}>
                    <img src={url.decode(window.systemMain.siteLogo,true)} sx={{
                        width: "100%"
                    }}>
                    </img>
                </Grid>
                <Grid item xs={10} sx={{
                    textAlign: 'left',
                    paddingLeft: "10px"
                }}>
                    <Typography variant="p" sx={{
                        flexGrow: 1,
                        textAlign: "center",
                        fontSize: "0.8rem",
                        color: window.systemMain.fontP

                    }}>
                        {window.systemLang.strapLine}
                    </Typography>
                </Grid>

            </Grid>
        </Box>
    )
}

export default LogoStrapLine;