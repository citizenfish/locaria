import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {useHistory} from "react-router-dom";
import UrlCoder from "../../../libs/urlCoder";

const PageList = function () {
    const history = useHistory();
    const url = new UrlCoder();

    const Panels = () => {
        let panelArray = [];
        for (let p in window.siteMap) {
            panelArray.push(
                <Grid item xs={2} key={window.siteMap[p].key}>
                    <Typography style={{color: window.siteMap[p].backgroundColor}} variant={"h6"} onClick={() => {
                        let route = url.route(window.siteMap[p].link);
                        if (route === true) {
                            history.push(window.siteMap[p].link);
                        }
                    }
                    }>
                        {window.siteMap[p].name}
                    </Typography>
                </Grid>
            )
        }

        return panelArray;

    }

    return (
        <Box sx={{
            flexGrow: 1,
            textAlign: 'center'
        }}>
            <Grid container spacing={2} sx={{
                flexGrow: 1
            }}>
                <Panels></Panels>
            </Grid>
        </Box>
    )

}

export default PageList;