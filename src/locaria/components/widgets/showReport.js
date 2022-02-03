import Typography from "@mui/material/Typography";
import React from "react";
import {useStyles} from 'stylesLocaria';

import Button from "@mui/material/Button";

import CardImageLoader from "./cardImageLoader";
import {configs,channels} from "themeLocaria";
import LinearProgress from "@mui/material/LinearProgress";

import SearchDrawCard from "./searchDrawCard";

import {FieldView} from './fieldView'
import Share from "./share";

const ShowReport = ({viewData,viewWrapper,fid,mapRef}) => {

	const classes = useStyles();

	const [report, setReport] = React.useState(null);

	let channel = channels.getChannelProperties(viewData.features[0].properties.category);

	React.useEffect(() => {

		window.websocket.registerQueue("reportLoader", function (json) {
			console.log(json);
			setReport(json.packet);

			mapRef.current.addGeojson(json.packet,"data",false);
			mapRef.current.zoomToLayerExtent("data");


		});

		if(report===null&&channel.report!==undefined) {
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

	if (viewData && viewData.features &&viewData.features.length > 0) {

		return (

				<div>
					<div className={classes.ReportProfileHeader}>
						<div className={classes.ReportProfileImageContainer}>
							<CardImageLoader className={classes.ReportProfileImage}
							                 images={viewData.features[0].properties.description.images}
							                 defaultImage={configs.defaultImage} gallery={true}/>
						</div>
							<FieldView data={viewData.features[0].properties}></FieldView>
							<Share/>
					</div>
					{report!==null? (report.features.map((item, index) => (
						<SearchDrawCard key={index} {...item} viewWrapper={viewWrapper} mapRef={mapRef}/>
					))):null}
				</div>
			);
	} else {
		return (
			<LinearProgress/>

		)
	}
}

export default ShowReport;