import React from 'react';
import RenderMarkdown from "./renderMarkdown";
import {LinearProgress} from "@mui/material";

export default function RenderPage({page}) {

    const [pageData, setPageData] = React.useState(undefined);

    const getPageData = () => {
        window.websocket.send({
            "queue": "getPageData",
            "api": "api",
            "data": {
                "method": "get_parameters",
                "parameter_name": `page_${page}`
            }
        });
    }

    React.useEffect(() => {

        window.websocket.registerQueue('getPageData', (json) => {
            setPageData(json.packet[`page_${page}`]);
        });

        if (page) {
            getPageData();
        }
    }, [page]);


    if(pageData) {
        return (
            <RenderMarkdown markdown={pageData.data}/>

        )
    } else {
        return (<LinearProgress></LinearProgress>)
    }
}