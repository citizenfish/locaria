import Typography from "@mui/material/Typography";
import React from "react";
import {useStyles} from 'stylesLocaria';

import Button from "@mui/material/Button";

import CardImageLoader from "./cardImageLoader";
import {configs, channels} from "themeLocaria";
import LinearProgress from "@mui/material/LinearProgress";

import SearchDrawCard from "./draws/cards/searchDrawCard";

import {FieldView} from './fieldView'
import Share from "./share";
import {InView} from "react-intersection-observer";
import {Container, Divider} from "@mui/material";

const ShowReport = ({viewData, fid, mapRef}) => {

	const classes = useStyles();

	const [report, setReport] = React.useState(null);
	const [displayData, setDisplayData] = React.useState(null);
	const [isInView, setIsInView] = React.useState(false);
	const [position, setPosition] = React.useState(0);
	const [moreResults, setMoreResults] = React.useState(false);

	let channel = channels.getChannelProperties(viewData.features[0].properties.category);

	const addDisplayData = (data) => {
		if(data) {
			setDisplayData(data);
			setPosition(10);
			mapRef.current.addGeojson({features: data, "type": "FeatureCollection"}, "data", false);

		} else {
			setDisplayData(displayData.concat(report.features.splice(position,10)));
			setPosition(position+10);
			if(position+10>report.features.length)
				setMoreResults(false);
			mapRef.current.addGeojson({features: report.features.splice(position,10), "type": "FeatureCollection"}, "data", false);


		}
		mapRef.current.zoomToLayersExtent(["data"]);

	}

	const inViewEvent = function (event) {
		console.log(event);
		setIsInView(event);
		if (event === true) {
			addDisplayData();
		}
	}

	React.useEffect(() => {

	}, [displayData]);

	React.useEffect(() => {

		window.websocket.registerQueue("reportLoader", function (json) {
			console.log(json);
			setReport(json.packet);
			addDisplayData(json.packet.features.slice(0, 10));
			if(json.packet.features.length>10)
				setMoreResults(true);




		});

		if (report === null && channel.report !== undefined) {
			window.websocket.send(
				{
					"queue": "reportLoader",
					"api": "api",
					"data": {
						"method": "report",
						"report_name": channel.report,
						/*
												"location": `SRID=4326;POINT(${location.location[0]} ${location.location[1]})`,
						*/
						"fid": fid
					}
				}
			);
		}

		return () => {
			window.websocket.removeQueue("reportLoader");
		}


	}, [report]);

	if (viewData && viewData.features && viewData.features.length > 0) {

		return (

			<div>
				<Container className={classes.ReportProfileHeader}>
					<div className={classes.ReportProfileImageContainer}>
						<CardImageLoader className={classes.ReportProfileImage}
						                 images={viewData.features[0].properties.description.images}
						                 defaultImage={channel.image? channel.image:configs.defaultImage} gallery={true}/>
					</div>
					<FieldView data={viewData.features[0].properties}></FieldView>
					<Share/>
				</Container>
				{displayData !== null && (
					<>
						<Divider className={classes.ReportInfoDivider}/>
						<Typography className={classes.ReportProfileTitle}>Links</Typography>
						{displayData.map((item, index) => (
							<SearchDrawCard key={index} {...item}  mapRef={mapRef} full={true}/>
						))}
					</>
				)}
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
			</div>
		);
	} else {
		return (
			<LinearProgress/>

		)
	}
}

export default ShowReport;