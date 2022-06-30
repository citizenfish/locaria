import React from 'react';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import UrlCoder from "../../../libs/urlCoder";
import TypographyParagraph from "../typography/typographyParagraph";
const url=new UrlCoder();


const LogoStrapLine = () => {

    return (
        <Box key={"logoStrapLine"} sx={{
            width: "calc(100% - 20px)",
        }}>
            <Grid container sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Grid item xs={3} sx={{
                    textAlign: 'center'
                }}>
                    <img src={url.decode(window.systemMain.siteLogo,true)} sx={{
                        width: "100%"
                    }}>
                    </img>
                </Grid>
                <Grid item xs={9} sx={{
                    textAlign: 'left',
                    paddingLeft: "10px",
                    paddingTop: "5px",
                    paddingBottom: "5px"
                }}>
                    <Typography variant="p" sx={{
                        flexGrow: 1,
                        fontSize: "0.8rem",
                        color: window.systemMain.fontP

                    }}>
                        <TypographyParagraph sx={{textAlign:"left"}}>{window.systemLang.strapLine}</TypographyParagraph>
                    </Typography>
                </Grid>

            </Grid>
        </Box>
    )
}

export default LogoStrapLine;