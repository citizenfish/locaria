import React from "react"
import {InView} from "react-intersection-observer";

import {useStyles} from "stylesLocaria";
import SearchDrawerCard from "../drawers/cards/searchDrawerCard";

export default function FeatureSearchResults(props) {

    let featureResults = props.featureResults
    const inViewEvent = props.inViewEvent
    const moreResults = props.moreResults
    const classes = useStyles();

    if(featureResults.length <= 0) {
        return(<></>)
    }

    return(
        <div>
                {
                    <div className={classes.searchDrawerResultList}>
                        {featureResults.map((item, index) => (
                            <SearchDrawerCard more={true} key={index} {...item} mapRef={props.mapRef}/>
                        ))}
                    </div>
                }
                {moreResults ? (
                    <div sx={{height: '10px'}}>
                        <InView as="div" onChange={(inView, entry) => {
                            inViewEvent(inView)
                        }}>
                        </InView>

                    </div>
                ) : <div/>
                }

            </div>
    )
}