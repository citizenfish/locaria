import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import BurgerMenu from "./burgerMenu";
import {useHistory} from "react-router-dom";
import RenderMarkdown from "../markdown/renderMarkdown";

const NavTypeActive = function ({}) {

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
                // backgroundColor: window.systemMain.headerBackground,
                backgroundImage: "linear-gradient(5deg, #fa8080, #ffdf62 87.14%, #f7ec94 91.18%)",
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
                <Grid onClick={()=>{history.push('/')}} item md={11} sx={{
                    textAlign: "center",
                    verticalAlign: "middle",
                }}>
                    <Typography sx={{fontFamily: "Montserrat", color: "#FFF", fontWeight:800, letterSpacing:"0.1em"}}>Your Active Prescription</Typography>
                </Grid>
                {/*<Grid onClick={()=>{history.push('/')}} item md={6} sx={{*/}
                {/*    display: {*/}
                {/*        md: "block",*/}
                {/*        xs: "none"*/}
                {/*    },*/}
                {/*}}>*/}
                {/*</Grid>*/}
            </Grid>
        </Box>
    )
}

export default NavTypeActive;