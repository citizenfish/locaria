import React, {useState} from "react"
import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';

import Typography from '@mui/material/Typography';

import {configs} from "themeLocaria";
import {useStyles} from "stylesLocaria";

import SearchDrawerCard from "../drawers/cards/searchDrawerCard";
import {setLocation} from "../../../../../deprecated/layoutSlice";
import {useDispatch} from "react-redux";

export default function LocationSearchResults(props) {
    const dispatch = useDispatch()

    let locationResults = props.locationResults
    const classes = useStyles();
    //const [cookies, setCookies] = useCookies(['location']);
    const [open, setOpen] = useState(false);


  /*  if(locationResults.length <= 0) {
        return(<></>)
    }
*/
   /* if(locationShow){
        locationResults = [locationResults[0]]
    }
*/
    if(locationResults.length<1) {
        return (
            <Accordion expanded={false}>
                <AccordionSummary
                    aria-controls="panel1a-content"
                    id="locationResultsAccordionSummary"

                >
                    <DeleteIcon color={"secondary"} onClick={() =>{
                        dispatch(setLocation(configs.defaultLocation));
                    }}></DeleteIcon>
                    <Typography variant="subtitle2"
                                className={classes.searchDrawerAccordionTitle}>Your location: {cookies.location.name}</Typography>

                </AccordionSummary>
            </Accordion>
        )
    } else {

        return (
            <Accordion expanded={open}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon onClick={()=>{setOpen(!open);}}/>}
                    aria-controls="panel1a-content"
                    id="locationResultsAccordionSummary"

                >
                    <Typography variant="subtitle2"
                                className={classes.searchDrawerAccordionTitle}>Your location: {cookies.location.name}</Typography>

                </AccordionSummary>
                <AccordionDetails sx={{p: 0, m: 0}}>
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
}