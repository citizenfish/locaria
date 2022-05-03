import React, {forwardRef, useContext, useEffect, useRef} from "react";

import {useHistory} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux'
import {clearRefresh, setSearch, setTotalPages,} from "../../redux/slices/searchDrawerSlice";
import {closeViewDraw} from "../../redux/slices/viewDrawerSlice";
import {openLayout, closeLayout} from "../../redux/slices/layoutSlice";
import {closeLandingDraw} from "../../redux/slices/landingDrawerSlice";

//** MUI **//
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from '@mui/icons-material/Delete';


//** LOCARIA **//

import {useStyles} from "stylesLocaria";
import {configs, channels} from "themeLocaria";
import Distance from "../../../libs/Distance";
import LocationSearchResults from "../searchResults/locationSearchResults";
import FeatureSearchResults from "../searchResults/featureSearchResults";
import {Divider, Drawer} from "@mui/material";
import PageSearchResults from "../searchResults/pageSearchResults";

const SearchDrawer = forwardRef((props, ref) => {

        const history = useHistory();
        const dispatch = useDispatch()

        const distanceLib = new Distance();

        const open = useSelector((state) => state.searchDraw.open);
        const categories = useSelector((state) => state.searchDraw.categories);
        const search = useSelector((state) => state.searchDraw.search);
        const locationShow = useSelector((state) => state.searchDraw.locationShow);
        const resolutions = useSelector((state) => state.layout.resolutions);
        const distance = useSelector((state) => state.searchDraw.distance);
        const distanceType = useSelector((state) => state.searchDraw.distanceType);
        const refresh = useSelector((state) => state.searchDraw.refresh);
        const tags = useSelector((state) => state.searchDraw.tags);
        const page = useSelector((state) => state.searchDraw.page);
        const homeLocation = useSelector((state) => state.layout.homeLocation);

        const classes = useStyles();
        const [fit, setFit] = React.useState(true);
        const [searchResults, setSearchResults] = React.useState([]);
        const [locationResults, setLocationResults] = React.useState([]);
        const [channel, setChannel] = React.useState(undefined);

        const isInitialMount = useRef(true);


        useEffect(() => {
            if (isInitialMount.current) {
                isInitialMount.current = false;
            } else {
                if (open === true) {
                    history.push(`/Search/${JSON.stringify(categories)}/${search}`);
                    dispatch(closeViewDraw());
                    dispatch(closeLayout());
                    dispatch(closeLandingDraw());
                    props.mapRef.current.addGeojson({"features": searchResults, type: "FeatureCollection"});
                    props.mapRef.current.zoomToLayersExtent(["data", "location", "home"]);
                    /*if (searchResults.length === 0)
                        doSearch('new');
*/
                }
            }
        }, [open]);


        useEffect(() => {
            if (refresh === true && open === true) {
                setChannel(channels.getChannelProperties(categories[0]));

                history.push(`/Search/${JSON.stringify(categories)}/${search}`);
                document.getElementById('mySearch').value = search;
                dispatch(clearRefresh());
                doSearch('new');
            }
        }, [refresh]);

        useEffect(() => {

            window.websocket.registerQueue("searchBulk", function (json) {
                // Feature results

                const newResults = searchResults.concat(json.searchLoader.packet.geojson.features);
                setSearchResults(newResults);
                dispatch(setTotalPages(json.searchLoader.packet.options.count / window.systemMain.searchLimit))
                props.mapRef.current.addGeojson({"features": newResults, type: "FeatureCollection"});

                // Location results
                if (json.locationLoader.packet.features) {
                    setLocationResults(json.locationLoader.packet.features);
                } else {
                    setLocationResults([]);
                }

                // Do we fit the results (first time we fit)
                if (fit)
                    props.mapRef.current.zoomToLayersExtent(["data", "location", "home"]);
                else
                    setFit(false);

            });

            return () => {
                window.websocket.removeQueue("searchLoader");
            }


        }, [searchResults]);

        useEffect(() => {
            if (channel && channel.searchReport) {
                setFit(false);
                doSearch();
            }
        }, [resolutions]);

        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                setNewSearch();
            }
        }

        const setNewSearch = () => {
            let newSearchValue = document.getElementById('mySearch').value;
            dispatch(setSearch({search: newSearchValue}));
        }

        const clearSearch = (e) => {
            document.getElementById('mySearch').value = ''
            setNewSearch()
        }

        const doSearch = () => {
            if (open !== true)
                return;
            //let newSearchValue = document.getElementById('mySearch').value;
            let offset = (page - 1) * window.systemMain.searchLimit;
            setSearchResults([]);


            let packetSearch = {
                "queue": "searchLoader",
                "api": "api",
                "data": {
                    "method": "search",
                    "category": categories.length > 0 ? categories : configs.homeCategorySearch,
                    "search_text": search,
                    "limit": window.systemMain.searchLimit,
                    "offset": offset,
                    "mask": {distance: true, fid: true, category: true, tags: true, description: {title: true, text: true}}
                }
            };

            if (tags.length > 0) {
                packetSearch.data.tags = tags;
            }

            if (distance > 0) {
                packetSearch.data.location_distance = distanceLib.distanceActual(distance, distanceType);
                packetSearch.data.location = `SRID=4326;POINT(${homeLocation.location[0]} ${homeLocation.location[1]})`;
            }


            if (channel && channel.searchReport) {
                packetSearch.data.method = "report";
                packetSearch.data.report_name = channel.searchReport;
                if (resolutions.resolution >= configs.clusterCutOff)
                    packetSearch.data.cluster = true;
                packetSearch.data.bbox = `${resolutions.extent4326[0]} ${resolutions.extent4326[1]},${resolutions.extent4326[2]} ${resolutions.extent4326[3]}`;
            }

            if (search === '' && categories.length === 0) {
                //packetSearch.data.tags = ['featured'];
            }

            let packetLocation = {
                "queue": "locationLoader",
                "api": "api",
                "data": {
                    "method": "address_search",
                    "address": search
                }
            }
            window.websocket.sendBulk('searchBulk', [
                packetSearch,
                packetLocation
            ]);
            //window.websocket.send(packet);
        }


        return (
            <Drawer
                anchor="bottom"
                open={open}
                className={classes.searchDrawer}
                variant="persistent"
            >
                <div className={classes.searchDrawerHeader}>
                    <Typography className={classes.searchDrawerTitle} variant={'h6'}>{configs.searchTitle}</Typography>
                    <IconButton onClick={() => {
                        dispatch(openLayout());
                    }} className={classes.searchDrawerClose} type="submit"
                                aria-label="search">
                        <CloseIcon className={classes.icons}/>
                    </IconButton>
                </div>
                <Divider/>
                <div className={classes.searchDrawerSearch}>
                    <InputBase
                        className={classes.searchDrawerBox}
                        id="mySearch"
                        placeholder={configs.searchPlaceholder}
                        variant="filled"
                        onKeyDown={handleKeyDown}
                        autoComplete={'off'}
                        autoFocus={true}
                    />
                    <IconButton onClick={() => {
                        setNewSearch()
                    }}
                                type="submit"
                                aria-label="search">
                        <SearchIcon className={classes.iconsLight}/>
                    </IconButton>
                    <Divider orientation="vertical" className={classes.iconsLight}/>
                    <IconButton type="submit"
                                size="small"
                                onClick={clearSearch}
                    >
                        <DeleteIcon className={classes.iconsLight}/>
                    </IconButton>
                </div>
                <PageSearchResults></PageSearchResults>

                <LocationSearchResults
                    locationResults={locationResults}
                    mapRef={props.mapRef}
                    locationShow={locationShow}
                />
                <Divider/>


                <div className={classes.searchDrawerResults}>


                    <FeatureSearchResults
                        featureResults={searchResults}
                        mapRef={props.mapRef}
                    />

                </div>
                <Divider/>
                <div>

                </div>
            </Drawer>
        )
    }
);

export {SearchDrawer};