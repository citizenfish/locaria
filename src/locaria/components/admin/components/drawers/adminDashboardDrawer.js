import React, {useRef, useState} from "react"

import {Grid, Drawer, Card, CardContent, Typography, Select, TextField} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {closeUploadDrawer} from "../../redux/slices/uploadDrawerSlice";
import {closeEditFeatureDrawer} from "../../redux/slices/editFeatureDrawerSlice";
import {setTitle} from "../../redux/slices/adminSlice";
import {useStyles} from "../../../../../theme/default/adminStyle";
import {useHistory} from "react-router-dom";
import {useCookies} from "react-cookie";
import {closeAdminPageDrawer} from "../../redux/slices/adminPageDrawerSlice";
import {closeAdminCategoryDrawer} from "../../redux/slices/adminCategoryDrawerSlice";
import {closeLanguageDrawer} from "../../redux/slices/adminLanguageDrawerSlice";

import {XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalBarSeries,
    VerticalBarSeriesCanvas,
    FlexibleXYPlot,
    LabelSeries} from 'react-vis'

export default function AdminDashboardDrawer(props) {

    const open = useSelector((state) => state.adminDashboardDrawer.open);
    const dispatch = useDispatch()
    const classes = useStyles();
    const isInitialMount = useRef(true);
    const history = useHistory();

    const [cookies, setCookies] = useCookies(['location'])
    const [overview,setOverview] = useState({})
    const [barCharts,setbarCharts] = useState({})

    const BarSeries = VerticalBarSeriesCanvas

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        }

        window.websocket.registerQueue('setConfig', (json) => {
            getConfig();
        });

        window.websocket.registerQueue('getOverview', (json) => {
            if(json.packet.response_code === 200) {
                setOverview(json.packet)
            }
        })

        window.websocket.registerQueue('getbarCharts', (json) => {
            console.log(json)
            if(json.packet.response_code === 200) {
                setbarCharts(json.packet)
            }
        })

        if (open) {
            history.push(`/Admin/Dashboard/`);
            dispatch(closeUploadDrawer());
            dispatch(closeEditFeatureDrawer());
            dispatch(closeAdminPageDrawer());
            dispatch(closeAdminCategoryDrawer());
            dispatch(closeLanguageDrawer());

            dispatch(setTitle('Dashboard'));
        }

    }, [open]);


    useEffect(()=>{

        window.websocket.send({
            queue : 'getOverview',
            api : "sapi",
            data : {
                method: "report",
                report_name : "statistics_dashboard_overview",
                id_token: cookies['id_token']
            }
        })

        window.websocket.send({
            queue : 'getbarCharts',
            api : "sapi",
            data : {
                method: "report",
                report_name : "statistics_dashboard_bar_charts",
                id_token: cookies['id_token'],
                //TODO IN FOR DEBUG REMOVE!!!!
                date : "2022-05-04"

            }
        })

    },[])



    return (
        <Drawer
            anchor="right"
            open={open}
            variant="persistent"
            className={classes.adminDrawers}>

            <Grid container spacing={4}>
                <Grid item md={3}>
                    <Card style = {{backgroundColor: "rgb(0,166,90)", margin: "20px"}}>
                        <CardContent>
                            <Typography sx ={{fontSize:14}}>
                                Searches Today: {overview.today && overview.today.searches}
                            </Typography>
                            <Typography sx ={{fontSize:14}}>
                                Sessions Today: {overview.today && overview.today.sessions}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item md={3}>
                    <Card  style = {{backgroundColor: "rgb(0,192,239)", margin: "20px"}}>
                        <CardContent>
                            <Typography sx ={{fontSize:14}}>
                                Searches this week: {overview.week && overview.week.searches}
                            </Typography>
                            <Typography sx ={{fontSize:14}}>
                                Sessions this week: {overview.week && overview.week.sessions}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item md={3}>
                    <Card  style = {{backgroundColor: "rgb(243,156,18)", margin: "20px"}}>
                        <CardContent>
                            <Typography sx ={{fontSize:14}}>
                                Searches this month: {overview.month && overview.month.searches}
                            </Typography>
                            <Typography sx ={{fontSize:14}}>
                                Sessions this month: {overview.month && overview.month.sessions}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item md={3}>
                    <Card  style = {{backgroundColor: "rgb(221,75,57)", margin: "20px"}}>
                        <CardContent>
                            <Typography sx ={{fontSize:14}}>
                                Searches this year: {overview.year && overview.year.searches}
                            </Typography>
                            <Typography sx ={{fontSize:14}}>
                                Sessions this year: {overview.year && overview.year.sessions}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>

            <Grid container>
                <Grid  item md={12}>
                    <Card style = {{margin: "20px"}}>
                        <CardContent>
                            {
                                barCharts.users24 &&
                                <FlexibleXYPlot
                                    height = {300}
                                    xDistance = {100}
                                >
                                    <VerticalGridLines />
                                    <HorizontalGridLines />
                                    <XAxis />
                                    <YAxis />
                                    <VerticalBarSeries data={barCharts.searches24} />
                                    <VerticalBarSeries data={barCharts.users24} />
                                </FlexibleXYPlot>
                            }
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container>
                <Grid  item md={12}>
                    <Card style = {{margin: "20px"}}>
                        <CardContent>
                            {
                                barCharts.users10 &&
                                <FlexibleXYPlot
                                    height = {300}
                                    xDistance = {100}
                                    xType={"ordinal"}>
                                    <VerticalGridLines />
                                    <HorizontalGridLines />
                                    <XAxis  />
                                    <YAxis />
                                    <VerticalBarSeries data={barCharts.searches10} />
                                    <VerticalBarSeries  data={barCharts.users10} />
                                </FlexibleXYPlot>
                            }
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Drawer>
    )
}