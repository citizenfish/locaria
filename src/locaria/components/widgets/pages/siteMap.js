import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

const SiteMap = function () {


    const Panels = () => {
        let panelArray = [];
        for (let p in window.siteMap) {
            panelArray.push(
                <Grid item xs={2} key={window.siteMap[p].key}>
                    <Paper sx={{
                        textAlign: 'center',
                        margin: 10
                    }}>

                        <Box sx={{
                            backgroundColor: window.siteMap[p].backgroundColor,
                            color: window.siteMap[p].color,
                            border: `1px solid ${window.siteMap[p].color}`,
                            width: '200px'
                        }}>
                            {window.siteMap[p].name}
                        </Box>
                    </Paper>

                </Grid>
            )
        }

        return panelArray;

    }

    return (
        <Box sx={{
            //width: '100%',
            height: '30vh',
            background: window.systemMain.themePanels,
            margin: 10,
            flexGrow: 1,
            textAlign: 'center'
            }}>
            <Grid container spacing={2} sx={{
                margin: 10
            }}>
                <Panels></Panels>
            </Grid>
        </Box>
    )
}

export default SiteMap;