import React, {useEffect,useState} from 'react';
import TokenCheck from "../components/utils/tokenCheck";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import Box from "@mui/material/Box";
import {useCookies} from "react-cookie";
import {Card, CardContent, Grid, Typography} from "@mui/material";
import {DiscreteColorLegend, FlexibleXYPlot, RadialChart, VerticalBarSeries, XAxis, YAxis} from "react-vis";
import StripedDataGrid from "../../widgets/data/stripedDataGrid";


export default function AdminDataDashBoard(props){

    const [cookies, setCookies] = useCookies(['location'])
    const [overview,setOverview] = useState({})
    const [barCharts,setbarCharts] = useState({})
    const [pieCharts,setPieCharts] = useState({})
    const [lineItems,setLineItems] = useState({})

    const searchTermCols = [{field: 'srch', headerName: 'Search Term', width: 300}, {field: 'count', headerName: 'Count', width: 150}]

    const itemCols = [{field: 'title', headerName: 'Title', width: 200}, {field: 'category', headerName: 'Category', width: 200},{field: 'count', headerName: 'Count', width: 150}]

    useEffect(() => {

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


    }, []);

    return(<Box sx={{display: 'flex'}}>
        <TokenCheck></TokenCheck>
        <AdminAppBar title={`Dashboard`}/>
        <LeftNav isOpenReports={true}/>

        <Box
            component="main"
            sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '60px'}}
        >

            <div style={{
                width: '100%',
                maxWidth: '1200px',
            }}>

                {/*Top search summary panels*/}
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

                {/* Hourly search graph over 24 hour period*/}
                <Grid container>
                    <Grid  item md={12}>
                        <Typography variant={"h6"}>Searches by hour</Typography>
                        <Card style = {{margin: "20px"}}>
                            <CardContent>
                                {
                                    barCharts.users24 &&
                                    <div>
                                        <DiscreteColorLegend
                                            items={
                                                [
                                                    {title: "Searches",color: "rgb(243,156,18)"},
                                                    {title: "Sessions", color: "rgb(0,192,239)"}
                                                ]}
                                                orientation={"horizontal"}
                                                style = {{mb:2,fontSize:'11px'}}
                                        />
                                        <FlexibleXYPlot
                                            height = {200}
                                            xDistance = {30}
                                            xType={"ordinal"}
                                        >

                                            <XAxis style = {{fontSize:'11px'}}/>
                                            <YAxis style = {{fontSize:'11px'}}/>
                                            <VerticalBarSeries data={barCharts.searches24} color={"rgb(243,156,18)"}/>
                                            <VerticalBarSeries data={barCharts.users24} color={"rgb(0,192,239)"}/>
                                        </FlexibleXYPlot>
                                    </div>
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/*Daily search summary over 7 day period*/}
                <Grid container>
                    <Grid  item md={12}>
                        <Typography variant={"h6"}>Searches by day</Typography>
                        <Card style = {{margin: "20px"}}>
                            <CardContent>
                                {
                                    barCharts.users10 &&
                                    <div>
                                        <DiscreteColorLegend
                                            items={
                                                [
                                                    {title: "Searches",color: "rgb(243,156,18)"},
                                                    {title: "Sessions", color: "rgb(0,192,239)"}
                                                ]}
                                            orientation={"horizontal"}
                                            style = {{mb:2,fontSize:'11px'}}/>
                                        <FlexibleXYPlot
                                            height = {300}
                                            xType={"ordinal"}>

                                            <XAxis  style = {{fontSize:'11px'}}/>
                                            <YAxis style = {{fontSize:'11px'}}/>
                                            <VerticalBarSeries data={barCharts.searches10} />
                                            <VerticalBarSeries  data={barCharts.users10} />
                                        </FlexibleXYPlot>
                                    </div>
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/*Category search summary*/}
                <Grid container spacing={4} >
                    <Grid item md={6}>
                        <Typography variant={"h6"}>Categories</Typography>
                        <Card style = {{margin: "20px"}}>
                            <CardContent>
                                {
                                    pieCharts.categories &&
                                    <RadialChart height={320}
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
                        <Typography variant={"h6"}>Tags</Typography>
                        <Card style = {{margin: "20px"}}>
                            <CardContent style = {{display:"flex", margin: "auto"}}>
                                {
                                    pieCharts.tags &&
                                    <RadialChart height={320}
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

                {/*Search terms summary*/}
                <Grid container spacing={4}>
                    <Grid item md={6}>
                        <Typography variant={"h6"}>Search terms</Typography>
                        <Card style = {{margin: "20px"}}>
                            {
                                lineItems.search_terms &&
                                <StripedDataGrid style={{ height: 400, width: '100%' }}
                                          columns={searchTermCols}
                                          rows={lineItems.search_terms}
                                          pageSize={10}
                                />
                            }
                        </Card>
                    </Grid>
                    <Grid item md={6}>
                        <Typography variant={"h6"}>Popular items</Typography>
                        <Card style = {{margin: "20px"}}>
                            {
                                lineItems.items &&
                                <StripedDataGrid style={{ height: 400, width: '100%' }}
                                          columns={itemCols}
                                          rows={lineItems.items}
                                          pageSize={10}
                                />
                            }
                        </Card>
                    </Grid>
                </Grid>
            </div>

        </Box>
    </Box>)
}