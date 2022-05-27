import React, {forwardRef} from "react";
import {LinearProgress} from "@mui/material";

import {useSelector, useDispatch} from 'react-redux'
import {setReport} from "../../redux/slices/viewDrawerSlice";

import UrlCoder from "../../../libs/urlCoder";

import NavTypeSimple from "../navs/navTypeSimple";
import ViewFullDetails from "../viewLayouts/viewFullDetails";

const url = new UrlCoder();

const ViewDrawer = forwardRef((props, ref) => {
    const dispatch = useDispatch()
    const report = useSelector((state) => state.viewDraw.report);

    let channel = window.systemCategories.getChannelProperties(props.category);

    React.useEffect(() => {
        window.websocket.registerQueue("bulkLoader", function (json) {
            dispatch(setReport(json));
        });
        loadFeature();
        return () => {
            window.websocket.removeQueue("bulkLoader");
        }
    }, []);

    const loadFeature = () => {
            let featureLoader = {
                "queue": "viewLoader",
                "api": "api",
                "data": {"method": "get_item", "fid": props.fid}
            };
            let bulks = [featureLoader]
            if (channel.report) {
                bulks.push(
                    {
                        "queue": "reportLoader",
                        "api": "api",
                        "data": {
                            "method": "report",
                            "report_name": channel.report,
                            "fid": props.fid
                        }
                    }
                )
            }

            window.websocket.sendBulk('bulkLoader', bulks);
    }

    const viewList = {
        'FullDetails': <ViewFullDetails/>,
        'Simple': <NavTypeSimple/>
    }

    const RenderViewTemplate = () => {
        if (viewList[window.systemMain.viewMode])
            return viewList[window.systemMain.viewMode];
        return (<h1>[{window.systemMain.viewMode}] is not a valid view template</h1>)
    }

    const Content = () => {
        if (report === null) {
            return (<LinearProgress></LinearProgress>);
        } else {
            return (
                <>
                    <RenderViewTemplate/>
                </>
            )
        }
    }

    return (<Content/>)
});

export {ViewDrawer};
