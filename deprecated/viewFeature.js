import Typography from "@mui/material/Typography";
import React, {useRef} from "react";
import {useStyles} from 'stylesLocaria';

import Button from "@mui/material/Button";

import CardImageLoader from "../../cardImageLoader";
import {configs, channels} from "themeLocaria";
import LinearProgress from "@mui/material/LinearProgress";

import SearchDrawCard from "../../draws/cards/searchDrawCard";

import {FieldView} from '../../fieldView'
import Share from "../../share";
import {InView} from "react-intersection-observer";
import {Container, Divider} from "@mui/material";
import Grid from "@mui/material/Grid";
import Map from "../../map";

import {moreResults} from "../../../redux/slices/viewDrawSlice";
import {useDispatch, useSelector} from "react-redux";


const ViewFeature = ({viewData, mapRef, type}) => {
	const dispatch = useDispatch()

	const classes = useStyles();
	const category = useSelector((state) => state.viewDraw.category);

	const [report, setReport] = React.useState(null);
	const [displayData, setDisplayData] = React.useState(null);
	const [isInView, setIsInView] = React.useState(false);
	const [position, setPosition] = React.useState(0);
	const [moreResults, setMoreResults] = React.useState(false);

	const isInitialMount = useRef(true);

	let channel = channels.getChannelProperties(category);

	const addDisplayData = (data) => {
		if (data) {
			setDisplayData(data);
			setPosition(10);
			mapRef.current.addGeojson({features: data, "type": "FeatureCollection"}, "data", false);

		} else {
			setDisplayData(displayData.concat(report.features.splice(position, 10)));
			setPosition(position + 10);
			if (position + 10 > report.features.length)
				setMoreResults(false);
			mapRef.current.addGeojson({
				features: report.features.splice(position, 10),
				"type": "FeatureCollection"
			}, "data", false);


		}
		mapRef.current.zoomToLayersExtent(["data"]);

	}

	const inViewEvent = function (event) {
		console.log(event);
		dispatch(moreResults());
		/*	setIsInView(event);
			if (event === true) {
				addDisplayData();
			}*/
	}

	/*React.useEffect(() => {

		window.websocket.registerQueue("reportLoader", function (json) {
			console.log(json);
			setReport(json.packet);
			addDisplayData(json.packet.features.slice(0, 10));
			if(json.packet.features.length>10)
				setMoreResults(true);




		});

		if (report === null && channel.report !== undefined && isInitialMount.current===true) {
			isInitialMount.current=false;
			window.websocket.send(
				{
					"queue": "reportLoader",
					"api": "api",
					"data": {
						"method": "report",
						"report_name": channel.report,
						"fid": fid
					}
				}
			);
		}

		return () => {
			window.websocket.removeQueue("reportLoader");
		}


	}, [report]);*/

	const ReportResults = () => {
		if (viewData.reportLoader !== undefined) {
			return (
				<>
					<Divider className={classes.ReportInfoDivider}/>
					<Typography className={classes.ReportProfileTitle}>Links</Typography>
					{viewData.reportLoader.packet.features.map((item, index) => (
						<SearchDrawCard key={index} {...item} mapRef={mapRef} full={true}/>
					))}

					{moreResults ? (
						<div sx={{height: '10px'}}>
							<InView as="div" onChange={(inView, entry) => {
								inViewEvent(inView)
							}}>
							</InView>
							<LinearProgress/>
						</div>
					) : <div/>
					}
				</>
			)
		}
		return <></>
	}

	if (viewData && viewData.viewLoader.packet.features && viewData.viewLoader.packet.features.length > 0) {
		if (type === 'full') {
			return (
				<div>
					<Grid container className={classes.root} spacing={2} justifyContent="center">
						<Grid item md={4}>
							<Container className={classes.ReportProfileHeader}>
								<div className={classes.ReportProfileImageContainer}>
									<CardImageLoader className={classes.ReportProfileImage}
									                 images={viewData.viewLoader.packet.features[0].properties.description.images}
									                 defaultImage={channel.image ? channel.image : configs.defaultImage}
									                 gallery={true}/>
								</div>
								<FieldView data={viewData.viewLoader.packet.features[0].properties}></FieldView>
								<Share/>
							</Container>
						</Grid>
						<Grid item md={8}>
							<Map className={"ReportMap"}></Map>
						</Grid>
					</Grid>
					<ReportResults></ReportResults>
				</div>
			);
		}

		return (

			<div>
				<Container className={classes.ReportProfileHeader}>
					<div className={classes.ReportProfileImageContainer}>
						<CardImageLoader className={classes.ReportProfileImage}
						                 images={viewData.viewLoader.packet.features[0].properties.description.images}
						                 defaultImage={channel.image ? channel.image : configs.defaultImage}
						                 gallery={true}/>
					</div>
					<FieldView data={viewData.viewLoader.packet.features[0].properties}></FieldView>
					<Share/>
				</Container>
				<ReportResults></ReportResults>

			</div>
		);
	} else {
		return (
			<LinearProgress/>
		)
	}
}

export default ViewFeature;