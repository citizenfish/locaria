import React from "react"

import {useStyles} from "stylesLocaria";
import SearchDrawerCard from "../drawers/cards/searchDrawerCard";

export default function FeatureSearchResults(props) {

    let featureResults = props.featureResults
    const classes = useStyles();

    if (featureResults.length <= 0) {
        return (<></>)
    }

    return (

        <div className={classes.searchDrawerResultList}>
            {featureResults.map((item, index) => (
                <SearchDrawerCard more={true} key={index} {...item} mapRef={props.mapRef}/>
            ))}
        </div>

    )
}