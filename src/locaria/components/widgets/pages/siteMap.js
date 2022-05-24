import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {useHistory} from "react-router-dom";

import UrlCoder from "../../../libs/urlCoder"

const SiteMap = function () {

    const history = useHistory();
    const url=new UrlCoder();

    const Panels = () => {
        let panelArray = [];
        for (let p in window.siteMap) {
            let panelItems=[];
            for(let i in window.siteMap[p].items) {
                panelItems.push(
                    <Box onClick={()=>{
                        let route=url.route(window.siteMap[p].items[i].link);
                        if(route===true) {
                            history.push(window.siteMap[p].items[i].link);
                        }
                    }} sx={{
                        borderTop: `1px solid ${window.siteMap[p].color}`,
                            '&:hover': {
                                backgroundColor: '#fff'
                            }
                    }}>
                        {window.siteMap[p].items[i].name}
                    </Box>
                )
            }
            panelArray.push(
                <Grid item xs={2} key={window.siteMap[p].key}>
                    <Box sx={{
                        textAlign: 'center',
                        margin: '10px'
                    }}>

                        <Box sx={{
                            backgroundColor: window.siteMap[p].backgroundColor,
                            color: window.siteMap[p].color,
                            border: `2px solid ${window.siteMap[p].color}`,
                            width: '200px'
                        }}>
                            {window.siteMap[p].name}
                        </Box>
                        <Box sx={{
                            width: '200px',
                            border: `2px solid ${window.siteMap[p].color}`,
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

    return (
        <Box sx={{
            height: 'calc(30vh)',
            background: window.systemMain.themePanels,
            margin: 10,
            flexGrow: 1,
            textAlign: 'center'
            }}>
            <Grid container spacing={2} sx={{
                margin: 10,
                flexGrow: 1
            }}>
                <Panels></Panels>
            </Grid>
        </Box>
    )
}

export default SiteMap;