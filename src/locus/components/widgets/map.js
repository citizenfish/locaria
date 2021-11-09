import React from "react";

import {channels, useStyles, configs} from "themeLocus";
import Button from "@material-ui/core/Button";
import {viewStyle} from "../mapStyles/view";


const Map = ({ol, handleMapClick}) => {
	const classes = useStyles();

	React.useEffect(() => {
		ol.addMap({
			"target": "map",
			"projection": "EPSG:3857",
			"renderer": ["canvas"],
			"zoom": configs.defaultZoom,
			"center": configs.defaultLocation
		});
		ol.addLayer({
			"name": "xyz",
			"type": "xyz",
			"url": `https://api.os.uk/maps/raster/v1/zxy/${configs.OSLayer}/{z}/{x}/{y}.png?key=${configs.OSKey}`,
			"active": true
		});
		ol.addLayer({
			"name": "data",
			"type": "vector",
			"active": true,
			"style": viewStyle
		});
		if (handleMapClick !== undefined)
			ol.simpleClick({"clickFunction": handleMapClick});

	});

	const mapReset = () => {
		ol.updateSize();
	}

	return (
		<div id="map" className={classes.mapView}>
			<Button onClick={mapReset} className={classes.mapResetButton} color="secondary"
			        variant="outlined">Reset map</Button>
		</div>
	)
}

export default Map;