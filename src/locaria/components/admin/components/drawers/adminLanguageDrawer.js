import React, {useRef, useState} from "react"

import {Checkbox, Drawer, FormControlLabel, FormGroup, InputLabel, Select, TextField} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {closeUploadDrawer} from "../../redux/slices/uploadDrawerSlice";
import {closeEditFeatureDrawer} from "../../redux/slices/editFeatureDrawerSlice";
import {setTitle} from "../../redux/slices/adminSlice";
import {useStyles} from "../../../../../theme/default/adminStyle";
import {useHistory} from "react-router-dom";
import Button from "@mui/material/Button";
import {useCookies} from "react-cookie";
import {closeAdminPageDrawer} from "../../redux/slices/adminPageDrawerSlice";
import {closeDashboardDrawer} from "../../redux/slices/adminDashboardDrawerSlice";
import {setAdminLanguage, setAdminLanguageValue} from "../../redux/slices/adminLanguageDrawerSlice";
import Box from "@mui/material/Box";
import {closeSystemConfigDrawer} from "../../redux/slices/systemConfigDrawerSlice";
import {closeAdminCategoryDrawer} from "../../redux/slices/adminCategoryDrawerSlice";

export default function AdminLanguageDrawer(props) {

    const open = useSelector((state) => state.adminLanguageDrawer.open);
    const language = useSelector((state) => state.adminLanguageDrawer.language);
    const dispatch = useDispatch()
    const classes = useStyles();
    const isInitialMount = useRef(true);
    const history = useHistory();

    const [cookies, setCookies] = useCookies(['location']);


    const [current, setCurrent]=useState('ENG');

    const langDef={
        "siteTitle":{ description:"Sites title", default: "Locaria"},
        "siteSubTitle":{ description:"Sites sub title", default: "Winning"},
        "siteFooter":{ description:"Site footer", default: "&copy; Locaria"},
        "strapLine":{ description:"Strap line", default: "This is the strap line"},
        "addressLine":{ description:"Address, Single line", default: "Address line"},
        "siteCallToAction": { description: "Call to action on landing page", default: "Learn more about your location" },
        "siteSubCallToAction": { description: "Sub call to action on landing page", default: "Enter an address or postcode to find information about that area" },
        "channelCallToAction": { description: "Channel call to action on landing page", default: "Click on one of the channels below to find out more about your selected location." },
        "contactTitle": { description: "Contact H2 Title", default: "Contact us" },
        "contactSubHeading": { description: "Contact H3 sub heading", default: "Fill out the form" },
        "searchInstruction": "Search for a location or item",
        "distanceLabel": "kilometres",
        "locationResultsHeader": "Locations Found",
        "featureResultsHeader": "Items Found",
        "resetCategoryText": "Reset Category",
        "selectAllCategoryText": "Select All",
        "resetDistanceText": "Reset Proximity",
        "distanceSelectText": "Proximity",
        "tagSelectText": "Tags applied",
        "noTagsSelectedText": "No Tags active",
        "resetTagsText": "Clear Tags",
        "selectAllTagsText": "Select All",
        "setAsLocationText": "Set as Default",
        "copyrightCompany": "(c) Nautoguide Ltd. 2022",
        "copyrightLink": "https://nautoguide.com",
        "poweredByLink": "https://github.com/nautoguide/locaria",
        "poweredByText": "Powered by Locaria",
        "licensedLink": "https://github.com/nautoguide/locaria/blob/master/LICENSE",
        "licensedText": "Licensed under the GPL 3.0",
        "contactFormTitle": "Contact Us",
        "contactFormText": "Feel free to contact us with any questions you may have about Locaria",
        "contactFormNameLabel": "Name",
        "contactFormEmailLabel": "Email Address",
        "contactFormMessageLabel": "Your Message",
        "contactFormSubmitLabel": "Send Message",
        "contactFormSubmittedTitle": "Your message has been sent",
        "contactFormSubmittedText": "Thank you for contacting us we will respond as soon as we possibly can",
        "contactFormMessageIdText": "Message ID"
    }


    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        }

        window.websocket.registerQueue('getLanguage', (json) => {
            if(json.packet[`lang${current}`])
                dispatch(setAdminLanguage(json.packet[`lang${current}`]));
            else
                dispatch(setAdminLanguage({}));
        });

        window.websocket.registerQueue('setLanguage', (json) => {
            getConfig();
        });

        if (open) {
            history.push(`/Admin/Language/`);
            dispatch(closeUploadDrawer());
            dispatch(closeSystemConfigDrawer());
            dispatch(closeEditFeatureDrawer());
            dispatch(closeAdminPageDrawer());
            dispatch(closeDashboardDrawer());
            dispatch(closeAdminCategoryDrawer());


            dispatch(setTitle('Language'));
            getConfig();
        }

    }, [open]);

    const getConfig = () => {
        window.websocket.send({
            "queue": "getLanguage",
            "api": "api",
            "data": {
                "method": "get_parameters",
                "parameter_name": `lang${current}`,
                id_token: cookies['id_token'],
            }
        });
    }

    const setConfig = (e) => {
        window.websocket.send({
            "queue": "setConfig",
            "api": "sapi",
            "data": {
                "method": "set_parameters",
                "acl": "external",
                "parameter_name": `lang${current}`,
                id_token: cookies['id_token'],
                "parameters": language
            }
        });
        window.systemLang=language;
    }

    const field = (field) => {
        return (
            <TextField
                id={field}
                label={langDef[field].description}
                defaultValue={langDef[field].default}
                variant="filled"
                fullWidth={true}
                value={language[field]}
                onChange={(e) => {
                    dispatch(setAdminLanguageValue({
                        key: field,
                        value: e.target.value
                    }));
                }}
            />
        )
    }


    return (
        <Drawer
            anchor="right"
            open={open}
            variant="persistent"
            className={classes.adminDrawers}

        >
            <Box sx={{margin:"50px"}}>
            <h1>Language</h1>
            {language&&
                <>
                    {Object.keys(langDef).map(value => (
                            field(value)
                        ))
                    }
                    <Button variant={"outlined"} onClick={(e) => {
                        setConfig(e)
                    }}>Save</Button>
                </>
            }
            </Box>


        </Drawer>
    )
}