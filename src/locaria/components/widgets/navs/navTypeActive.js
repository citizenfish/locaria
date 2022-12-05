import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import BurgerMenu from "./burgerMenu";
import {useHistory} from "react-router-dom";

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
                    <p>Active header is active</p>
                </Grid>
                <Grid onClick={()=>{history.push('/')}} item md={6} sx={{
                    display: {
                        md: "block",
                        xs: "none"
                    },
                }}>
                </Grid>
            </Grid>
        </Box>
    )
}

export default NavTypeActive;