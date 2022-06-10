import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {useHistory} from "react-router-dom";

import UrlCoder from "../../../libs/urlCoder"

const SiteMap = function (props) {

    const history = useHistory();
    const url = new UrlCoder();

    const Panels = () => {
        let panelArray = [];
        for (let p in window.siteMap) {
            let panelItems = [];
            for (let i in window.siteMap[p].items) {
                panelItems.push(
                    <Box key={i} onClick={() => {
                        let route = url.route(window.siteMap[p].items[i].link);
                        if (route === true) {
                            history.push(window.siteMap[p].items[i].link);
                        }
                    }} sx={{
                        borderTop: `1px solid ${window.siteMap[p].color}`,
                        fontSize: "0.8rem",
                        '&:hover': {
                            opacity: "0.5"
                        }
                    }}>
                        {window.siteMap[p].items[i].name}
                    </Box>
                )
            }
            panelArray.push(
                <Grid item md={2} key={window.siteMap[p].key}>
                    <Box sx={{
                        textAlign: 'center',
                        margin: '10px'
                    }}>

                        <Box sx={{
                            backgroundColor: window.siteMap[p].backgroundColor,
                            color: window.siteMap[p].color,
                            fontSize: "0.8rem",
                            border: { md: `2px solid ${window.siteMap[p].color}`, xs: `1px solid ${window.siteMap[p].color}`},
                            width: '100%',
                            padding: "5px"
                        }} onClick={() => {
                            let route = url.route(window.siteMap[p].link);
                            if (route === true) {
                                history.push(window.siteMap[p].link);
                            }
                        }
                        }>
                            {window.siteMap[p].name}
                        </Box>
                        <Box sx={{
                            width: '100%',
                            border: { md: `2px solid ${window.siteMap[p].color}`, xs: `1px solid ${window.siteMap[p].color}`},
                            marginTop: '5px',
                            backgroundColor: window.siteMap[p].backgroundColor,
                        }}>
                            {panelItems}
                        </Box>
                    </Box>

                </Grid>
            )
        }

        return panelArray;

    }

    let sx={
        background: window.systemMain.themePanels,
        margin: "10px",
        flexGrow: 1,
        textAlign: 'center'
    }

    if(props.mode==='full') {
        sx.backgroundImage=`url(${url.decode(window.systemMain.galleryImage,true)})`;
        sx.height='calc(30vh)';
        sx.backgroundSize="cover";
        sx.backgroundPositionY="50%";
    }

    return (
        <Box sx={sx}>
            <Grid container spacing={2} sx={{
                flexGrow: 1
            }}>
                <Panels></Panels>
            </Grid>
        </Box>
    )
}

export default SiteMap;