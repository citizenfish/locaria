import React, {useRef, useState} from "react"
import { DataGrid } from '@mui/x-data-grid';
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
import '../../../../../../node_modules/react-vis/dist/style.css'

import {XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalBarSeries,
    VerticalBarSeriesCanvas,
    FlexibleXYPlot,
    RadialChart,
    DiscreteColorLegend} from 'react-vis'

export default function AdminDashboardDrawer(props) {

    const open = useSelector((state) => state.adminDashboardDrawer.open);
    const dispatch = useDispatch()
    const classes = useStyles();
    const isInitialMount = useRef(true);
    const history = useHistory();

    const [cookies, setCookies] = useCookies(['location'])
    const [overview,setOverview] = useState({})
    const [barCharts,setbarCharts] = useState({})
    const [pieCharts,setPieCharts] = useState({})
    const [lineItems,setLineItems] = useState({})

    const searchTermCols = [{field: 'srch', headerName: 'Search Term', width: 300}, {field: 'count', headerName: 'Count', width: 150}]
    const itemCols = [{field: 'title', headerName: 'Title', width: 200}, {field: 'category', headerName: 'Category', width: 200},{field: 'count', headerName: 'Count', width: 150}]

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

        window.websocket.registerQueue('getBarCharts', (json) => {
            console.log(json)
            if(json.packet.response_code === 200) {
                setbarCharts(json.packet)
            }
        })

        window.websocket.registerQueue('getPieCharts', (json) => {
            console.log(json)
            if(json.packet.response_code === 200) {
                setPieCharts(json.packet)
            }
        })

        window.websocket.registerQueue('getLineItems', (json) => {
            console.log(json)
            if(json.packet.response_code === 200) {
                setLineItems(json.packet)
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

            window.websocket.send({
                queue: 'getOverview',
                api: "sapi",
                data: {
                    method: "report",
                    report_name: "statistics_dashboard_overview",
                    id_token: cookies['id_token']
                }
            })

            window.websocket.send({
                queue: 'getBarCharts',
                api: "sapi",
                data: {
                    method: "report",
                    report_name: "statistics_dashboard_bar_charts",
                    id_token: cookies['id_token']

                }
            })

            window.websocket.send({
                queue: 'getPieCharts',
                api: "sapi",
                data: {
                    method: "report",
                    report_name: "statistics_dashboard_pie_charts",
                    id_token: cookies['id_token']

                }
            })

            window.websocket.send({
                queue: 'getLineItems',
                api: "sapi",
                data: {
                    method: "report",
                    report_name: "statistics_dashboard_line_items",
                    id_token: cookies['id_token']
                }
            })
        }

    }, [open]);


    return (
        <Drawer
            anchor="right"
            open={open}
            variant="persistent"
            className={classes.adminDrawers}
            sx={{
                '.MuiDrawer-paperAnchorDockedRight': {
                    display: 'flex',
                    alignItems: 'center',
                },
                '.MuiDrawer-paper': {
                    borderLeft: 'none',
                    zIndex: 2,
                    backgroundColor: 'white',
                },
            }}
        >
            <div style={{
                width: '100%',
                maxWidth: '1200px',
            }}>
                <Grid container spacing={2}>
                    <Grid item md={3}>
                        <Card
                            style={{backgroundColor: "rgb(0,166,90)", margin: "20px"}}
                            sx={{
                                '.MuiCardContent-root': {
                                    ':last-child': {
                                        paddingBottom: 1,
                                    }
                                }
                            }}
                        >
                            <CardContent sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                justifyContent: 'space-between',
                                width: '100%',
                                color: 'white',
                                padding: 1,
                            }}>
                                <Typography>
                                    Searches Today
                                </Typography>
                                <Typography sx={{
                                    fontSize: 36,
                                    fontWeight: 'bold',
                                }}>
                                    {overview.today && overview.today.searches}
                                </Typography>
                                <Typography sx={{fontSize:12}}>
                                    Sessions Today: {overview.today && overview.today.sessions}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item md={3}>
                        <Card
                            style={{backgroundColor: "rgb(0,192,239)", margin: "20px"}}
                            sx={{
                                '.MuiCardContent-root': {
                                    ':last-child': {
                                        paddingBottom: 1,
                                    }
                                }
                            }}
                        >
                            <CardContent sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                justifyContent: 'space-between',
                                width: '100%',
                                color: 'white',
                                padding: 1,
                            }}>
                                <Typography>
                                    Searches this week:
                                </Typography>
                                <Typography sx={{
                                    fontSize: 36,
                                    fontWeight: 'bold',
                                }}>
                                    {overview.week && overview.week.searches}
                                </Typography>
                                <Typography sx={{fontSize:12}}>
                                    Sessions this week: {overview.week && overview.week.sessions}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item md={3}>
                        <Card
                            style={{backgroundColor: "rgb(243,156,18)", margin: "20px"}}
                            sx={{
                                '.MuiCardContent-root': {
                                    ':last-child': {
                                        paddingBottom: 1,
                                    }
                                }
                            }}
                        >
                            <CardContent sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                justifyContent: 'space-between',
                                width: '100%',
                                color: 'white',
                                padding: 1,
                            }}>
                                <Typography>
                                    Searches this month:
                                </Typography>
                                <Typography sx={{
                                    fontSize: 36,
                                    fontWeight: 'bold',
                                }}>
                                    {overview.month && overview.month.searches}
                                </Typography>
                                <Typography sx ={{fontSize:12}}>
                                    Sessions this month: {overview.month && overview.month.sessions}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item md={3}>
                        <Card
                            style={{backgroundColor: "rgb(221,75,57)", margin: "20px"}}
                            sx={{
                                '.MuiCardContent-root': {
                                    ':last-child': {
                                        paddingBottom: 1,
                                    }
                                }
                            }}
                        >
                            <CardContent sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                justifyContent: 'space-between',
                                width: '100%',
                                color: 'white',
                                padding: 1,
                            }}>
                                <Typography>
                                    Searches this year:
                                </Typography>
                                <Typography sx={{
                                    fontSize: 36,
                                    fontWeight: 'bold',
                                }}>
                                    {overview.year && overview.year.searches}
                                </Typography>
                                <Typography sx ={{fontSize:12}}>
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
                                        <div>
                                            <DiscreteColorLegend items={[{title:"Searches", color: "rgb(243,156,18)"},{title:"Sessions", color: "rgb(0,192,239)"}]}
                                                                 orientation={"horizontal"}/>
                                            <FlexibleXYPlot
                                                height = {200}
                                                xDistance = {30}
                                                xType={"ordinal"}
                                            >

                                                <XAxis />
                                                <YAxis />
                                                <VerticalBarSeries data={barCharts.searches24} color={"rgb(243,156,18)"}/>
                                                <VerticalBarSeries data={barCharts.users24} color={"rgb(0,192,239)"}/>
                                            </FlexibleXYPlot>
                                        </div>
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
                                        <div>
                                            <DiscreteColorLegend items={[{title:"Searches", color: "rgb(243,156,18)"},{title:"Sessions", color: "rgb(0,192,239)"}]}
                                                                 orientation={"horizontal"}/>
                                            <FlexibleXYPlot
                                                height = {300}
                                                xType={"ordinal"}>

                                                <XAxis  />
                                                <YAxis />
                                                <VerticalBarSeries data={barCharts.searches10} />
                                                <VerticalBarSeries  data={barCharts.users10} />
                                            </FlexibleXYPlot>
                                        </div>
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={4} >
                    <Grid item md={6}>
                        <Card style = {{margin: "20px"}}>
                            <CardContent>
                            {
                                pieCharts.categories &&
                                <RadialChart height={300}
                                             data={pieCharts.categories}
                                             width={300}
                                             showLabels={true}
                                             className={"radialChart"}
                                />
                            }
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={6}>
                        <Card style = {{margin: "20px"}}>
                            <CardContent style = {{display:"flex", margin: "auto"}}>
                            {
                                pieCharts.tags &&
                                <RadialChart height={300}
                                             data={pieCharts.tags}
                                             width={300}
                                             showLabels={true}
                                             className={"radialChart"}
                                />
                            }
                            </CardContent>
                        </Card>

                    </Grid>
                </Grid>

                <Grid container spacing={4}>
                    <Grid item md={6}>
                        <Card style = {{margin: "20px"}}>
                            {
                                lineItems.search_terms &&
                                    <DataGrid style={{ height: 400, width: '100%' }}
                                              columns={searchTermCols}
                                              rows={lineItems.search_terms}
                                              pageSize={10}
                                              />
                            }
                        </Card>
                    </Grid>
                    <Grid item md={6}>
                        <Card style = {{margin: "20px"}}>
                            {
                                lineItems.items &&
                                <DataGrid style={{ height: 400, width: '100%' }}
                                          columns={itemCols}
                                          rows={lineItems.items}
                                          pageSize={10}
                                />
                            }
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </Drawer>
    )
}