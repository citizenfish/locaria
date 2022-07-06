import React from 'react';
import {useSelector} from "react-redux";
import {FieldView} from "../data/fieldView";
import Grid from "@mui/material/Grid";
import SingleFeatureImageBox from "../images/singleFeatureImageBox";
import Box from "@mui/material/Box";

const ViewFullDetails = ({mode}) => {
    const report = useSelector((state) => state.viewDraw.report);


    if(report&&report.viewLoader) {
        return (
            <>
                <FieldView data={report.viewLoader.packet.features[0].properties}/>
            </>
/*                <Grid container spacing={2} sx={{
                    margin: "5px"
                }}>
                    <Grid item xs={8}>
                            <FieldView data={report.viewLoader.packet.features[0].properties}/>
                    </Grid>
                    <Grid item xs={4}>
                        <SingleFeatureImageBox category={report.viewLoader.packet.features[0].properties.category} image={report.viewLoader.packet.features[0].properties.data.images[0]}/>
                    </Grid>
                </Grid>*/
        )
    } else {
        return (
            <h1>No data</h1>
        )
    }
}

export default ViewFullDetails;