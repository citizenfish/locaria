import React from "react"
import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

import {configs} from "themeLocaria";
import {useStyles} from "stylesLocaria";

import SearchDrawerCard from "../drawers/cards/searchDrawerCard";

export default function LocationSearchResults(props) {
    
    let locationResults = props.locationResults
    const locationShow = props.locationShow
    const classes = useStyles();
    
    if(locationResults.length <= 0) {
        return(<></>)
    }

    if(locationShow){
        locationResults = [locationResults[0]]
    }

    return(
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="locationResultsAccordionSummary"

            >
                <Typography variant="subtitle2" className={classes.searchDrawerAccordionTitle}>{configs.locationResultsHeader}</Typography>

            </AccordionSummary>
            <AccordionDetails sx={{p:0,m:0}}>
                {
                    <div className={classes.searchDrawerResultList}>
                        {locationResults.map((item, index) => (
                            <SearchDrawerCard more={true} key={index} {...item} mapRef={props.mapRef}/>
                        ))}
                    </div>
                }

            </AccordionDetails>
    </Accordion>
    )
}