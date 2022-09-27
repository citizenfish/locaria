import React from 'react';
import {useSelector} from "react-redux";
import {FieldView} from "../data/fieldView";
import {objectPathExists} from "../../../libs/objectTools";


export default function ViewFullDetails() {
    const report = useSelector((state) => state.viewDraw.report);


    if(objectPathExists(report,'viewLoader.packet.features[0].properties')) {
        return (
            <>
                <FieldView data={report.viewLoader.packet.features[0]}/>
            </>
        )
    } else {
        return (
            <h1>No data</h1>
        )
    }
}

