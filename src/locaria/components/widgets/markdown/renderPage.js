import React, {useRef} from 'react';
import RenderMarkdown from "./renderMarkdown";
import {LinearProgress} from "@mui/material";
import {useParams} from "react-router-dom";
import {setReport} from "../../redux/slices/viewDrawerSlice";
import {useDispatch} from "react-redux";

export default function RenderPage() {

    const dispatch = useDispatch()

    let {category} = useParams();
    let {page} = useParams();
    let {feature} = useParams();
    const [pageData, setPageData] = React.useState(undefined);


    let channel;

    if (category)
        channel = window.systemCategories.getChannelProperties(category);


    const getAllData = () => {
        let bulkPackage = [];
        bulkPackage.push(
            {
                "queue": "getPageData",
                "api": "api",
                "data": {
                    "method": "get_parameters",
                    "parameter_name": page||'Home'
                }
            }
        );

        if (feature) {
            bulkPackage.push(
                {
                    "queue": "viewLoader",
                    "api": "api",
                    "data": {"method": "get_item", "fid": feature}
                }
            )
        }

        if (channel && channel.report) {
            bulkPackage.push(
                {
                    "queue": "reportLoader",
                    "api": "api",
                    "data": {
                        "method": "report",
                        "report_name": channel.report,
                        "fid": feature
                    }
                }
            )
        }

        window.websocket.sendBulk('pageBulkLoader', bulkPackage);
    }

    React.useEffect(() => {

        window.websocket.registerQueue('pageBulkLoader', (json) => {
            setPageData(json.getPageData.packet.parameters[page||'Home']);
            dispatch(setReport(json));
        });

        getAllData();
    }, [page]);

    if (pageData) {
        return (
            <RenderMarkdown markdown={pageData.data}/>
        )
    } else {
        return (<LinearProgress></LinearProgress>)
    }
}