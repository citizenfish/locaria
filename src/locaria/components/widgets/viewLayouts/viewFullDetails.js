import React from 'react';
import {useSelector} from "react-redux";
import {FieldView} from "../data/fieldView";


export default function ViewFullDetails() {
    const report = useSelector((state) => state.viewDraw.report);


    if(report&&report.viewLoader) {
        return (
            <>
                <FieldView data={report.viewLoader.packet.features[0].properties}/>
            </>
        )
    } else {
        return (
            <h1>No data</h1>
        )
    }
}

