import React from 'react';
import {useParams} from "react-router-dom";
import {setReport} from "../../redux/slices/viewDrawerSlice";
import {useDispatch} from "react-redux";

export default function LoadFeature() {

    const dispatch = useDispatch()

    let {category} = useParams();
    let {feature} = useParams();

    let channel = window.systemCategories.getChannelProperties(category);

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
            "data": {"method": "get_item", "fid": feature}
        };
        let bulks = [featureLoader]
        if (channel&&channel.report) {
            bulks.push(
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

        window.websocket.sendBulk('bulkLoader', bulks);
    }

    return (<></>);
}