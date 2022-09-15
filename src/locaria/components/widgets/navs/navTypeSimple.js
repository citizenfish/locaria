import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import BurgerMenu from "./burgerMenu";
import {useHistory} from "react-router-dom";
import RenderMarkdown from "../markdown/renderMarkdown";

const NavTypeSimple = function ({menu}) {

    const history = useHistory();


    return (
        <Box key={"navTypeSimple"} sx={{
            marginBottom: "20px",
            marginLeft: "5px",
            width: "100%"
        }}>
            <Grid container justifyContent="left" spacing={0.5} sx={{
                width: "100%",
                zIndex: '150',
                backgroundColor: window.systemMain.headerBackground,
                marginTop: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Grid item md={1} sx={{
                    textAlign: "left",
                    verticalAlign: "middle",

                }}>
                    <BurgerMenu></BurgerMenu>

                </Grid>
                <Grid onClick={()=>{history.push('/')}} item md={5} sx={{
                    textAlign: "right",
                    verticalAlign: "middle",


                }}>
                    <RenderMarkdown markdown={window.systemLang.siteTitle ? window.systemLang.siteTitle : 'Locaria'}/>
                </Grid>
                <Grid onClick={()=>{history.push('/')}} item md={6} sx={{
                    display: {
                        md: "block",
                        xs: "none"
                    },
                }}>
                    <RenderMarkdown markdown={window.systemLang.siteSubTitle}/>
                </Grid>
            </Grid>
        </Box>
    )
}

export default NavTypeSimple;