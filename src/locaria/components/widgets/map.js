import React, {forwardRef, useRef, useImperativeHandle} from 'react';

import {channels, configs} from "themeLocaria";
import {useStyles} from "stylesLocaria";

import Button from "@mui/material/Button";
import {viewStyle, locationStyle} from "mapStyle";
import Openlayers from "libs/Openlayers";
import {SpeedDial, SpeedDialAction} from "@mui/material";
import MapIcon from '@mui/icons-material/Map';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

const Map = forwardRef((props, ref) => {

	const classes = useStyles();
	const [ol, setOl] = React.useState(new Openlayers());
	const [location, setLocation] = React.useState(null);

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
			"url": configs.mapXYZ,
			"active": true,
			"attributions": configs.mapAttribution

		});
		ol.addLayer({
			"name": "location",
			"type": "vector",
			"active": true,
			"style": locationStyle
		});
		ol.addLayer({
			"name": "data",
			"type": "vector",
			"active": true,
			"style": viewStyle
		});

		// optionals
		if (props.handleMapClick !== undefined)
			ol.simpleClick({"clickFunction": props.handleMapClick});
		if (props.onZoomChange !== undefined) {
			ol.addResolutionEvent({"changeFunction": props.onZoomChange});
			const resolution = ol.updateResolution();
			// Force a zoom change
			props.onZoomChange(resolution);

		}
		if (props.onFeatureSeleted !== undefined)
			ol.makeControl({"layers": ["data"], "selectedFunction": props.onFeatureSeleted, "multi": true});

	}, [ol]);

	useImperativeHandle(
		ref,
		() => ({
			decodeCoords(flatCoordinates) {
				return ol.decodeCoords(flatCoordinates, 'EPSG:3857', 'EPSG:4326');
			},
			zoomToLayerExtent(layer, buffer) {
				buffer = buffer || configs.mapBuffer;
				ol.zoomToLayerExtent({"layer": layer, "buffer": buffer});
			},
			zoomToExtent(extent, buffer) {
				buffer = buffer || configs.mapBuffer;
				ol.zoomToLayerExtent({"layer": "data", "buffer": buffer, "extent": extent});
			},
			addGeojson(json, layer = "data", clear = true) {
				ol.addGeojson({"layer": layer, "geojson": json, "clear": clear});
			},
			markHome(location, layer = "location") {
				setLocation(location);
				ol.clearLayer({"layer": "location"});
				//ol.flyTo({"coordinate": location, "projection": "EPSG:4326"});
				ol.addGeojson({
					"layer": layer,
					"geojson": {
						"type": "FeatureCollection",
						"features": [
							{
								"geometry": {
									"type": "Point",
									"coordinates": location
								},
								"type": "Feature",
								"properties": {}
							}
						]
					}
				});
			}
		}),
	)
	const mapReset = () => {
		ol.updateSize();
		ol.flyTo({"coordinate": location, "projection": "EPSG:4326", "zoom": configs.defaultZoom});

	}

	const mapZoomIn = () => {
		ol.animateZoom({inc:+1});
	}

	const mapZoomOut = () => {
		ol.animateZoom({inc:-1});
	}

	return (
		<div id="map" className={classes.mapView}>
			<SpeedDial
				ariaLabel="SpeedDial basic example"
				icon={<MapIcon fontSize="medium"/>}
				className={classes.mapDial}
				direction={'down'}
			>

				<SpeedDialAction
					key={'reset'}
					icon={<RestartAltIcon/>}
					tooltipTitle={'Reset Map'}
					onClick={mapReset}
				/>
				<SpeedDialAction
					key={'zoomIn'}
					icon={<ZoomInIcon/>}
					tooltipTitle={'Zoom In'}
					onClick={mapZoomIn}
				/>
				<SpeedDialAction
					key={'zoomOut'}
					icon={<ZoomOutIcon/>}
					tooltipTitle={'Zoom Out'}
					onClick={mapZoomOut}
				/>

			</SpeedDial>
		</div>
	)
});

export default Map;