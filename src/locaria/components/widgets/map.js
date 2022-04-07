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
import InfoIcon from '@mui/icons-material/Info';

const Map = forwardRef((props, ref) => {

	const classes = useStyles();
	const [ol, setOl] = React.useState(new Openlayers());
	const [location, setLocation] = React.useState(null);

	React.useEffect(() => {
		ol.addMap({
			"target": props.id,
			"projection": "EPSG:3857",
			"renderer": ["canvas"],
			"zoom": configs.defaultZoom,
			"center": ol.decodeCoords(configs.defaultLocation.location, "EPSG:4326", "EPSG:3857"),
			"maxZoom": 16
		});
		ol.addLayer({
			"name": "xyz",
			"type": "xyz",
			"url": configs.mapXYZ,
			"active": true

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
			"style": function(feature,resolution) { return viewStyle(feature,resolution,ol);},
			"declutter": true
		});
		ol.addLayer({
			"name": "home",
			"type": "vector",
			"active": true,
			"style": locationStyle
		});

		// optionals
		if (props.handleMapClick !== undefined) {
			ol.simpleClick({"clickFunction": props.handleMapClick});
		}
		if (props.onZoomChange !== undefined) {
			ol.addResolutionEvent({"changeFunction": props.onZoomChange});
			const resolution = ol.updateResolution();
			// Force a zoom change
			props.onZoomChange(resolution);

		}
		if (props.onFeatureSeleted !== undefined) {
			ol.makeControl({"layers": ["data"], "selectedFunction": props.onFeatureSeleted, "multi": true});
		}

	}, [ol]);

	useImperativeHandle(
		ref,
		() => ({
			decodeCoords(flatCoordinates) {
				return ol.decodeCoords(flatCoordinates, 'EPSG:3857', 'EPSG:4326');
			},
			zoomToLayersExtent(layers, buffer) {
				buffer = buffer || configs.mapBuffer;
				ol.zoomToLayersExtent({"layers": layers, "buffer": buffer});
			},
			zoomToExtent(extent, buffer) {
				buffer = buffer || configs.mapBuffer;
				ol.zoomToLayersExtent({"layers": ["data"], "buffer": buffer, "extent": extent});
			},
			flyTo(coordinate,zoom,projection) {
				ol.flyTo({"coordinate":coordinate,"zoom":zoom,"projection":projection});
			},
			centerOnCoordinate(coordinate,zoom,projection) {
				ol.centerOnCoordinate({"coordinate":coordinate,"zoom":zoom,"projection":projection})
			},
			findFeatureByFid(map,layer,fid) {
				return ol.findFeatureByFid(map,layer,fid);
			},
			setHighlighted(map,layer,fids) {
				ol.setHighlighted(map,layer,fids);
			},
			clearHighlighted(map,layer) {
				ol.clearHighlighted(map,layer);
			},
			setSelected(map,layer,fids) {
				ol.setSelected(map,layer,fids);
			},
			addGeojson(json, layer = "data", clear = true) {
				ol.addGeojson({"layer": layer, "geojson": json, "clear": clear});
			},
			markHome(location) {
				setLocation(location);
				ol.clearLayer({"layer": "home"});
				ol.addGeojson({
					"layer": "home",
					"geojson": {
						"type": "FeatureCollection",
						"features": [
							{
								"geometry": {
									"type": "Point",
									"coordinates": location
								},
								"type": "Feature",
								"properties": {
									"featureType":"home"
								}
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

	const MapSpeedDial = () => {
		if(props.speedDial===false)
			return <></>;

		return (
		<SpeedDial
			ariaLabel="SpeedDial"
			icon={<MapIcon fontSize="medium"/>}
			className={classes.mapDial}
			direction={'up'}
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
			<SpeedDialAction
				key={'attr'}
				icon={<InfoIcon/>}
				tooltipTitle={configs.mapAttribution}
				tooltipOpen
			/>


		</SpeedDial>
		)
	}

	return (
		<div id={props.id} className={classes[props.className]}>
			<MapSpeedDial/>
		</div>
	)
});

export default Map;