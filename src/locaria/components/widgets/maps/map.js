import React, {forwardRef, useRef, useImperativeHandle} from 'react';

import { configs} from "themeLocaria";
import {useStyles} from "stylesLocaria";

import {viewStyle, locationStyle,reportStyle,vectorStyle} from "mapStyle";
import Openlayers from "libs/Openlayers";

import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import Chip from "@mui/material/Chip";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Box from "@mui/material/Box";
import {act} from "react-dom/test-utils";

const Map = forwardRef(({style='viewStyle',id,handleMapClick,onZoomChange,onFeatureSeleted,speedDial,sx,mapType='xyz',mapSource,mapStyle}, ref) => {

	const classes = useStyles();
	const [ol, setOl] = React.useState(new Openlayers());
	const [location, setLocation] = React.useState(null);

	const styles={
		viewStyle:viewStyle,
		locationStyle:locationStyle,
		reportStyle:reportStyle,
		vectorStyle:vectorStyle
	}

	const mapLayerStyle=style? styles[style]:styles['viewStyle'];
	const mapBaseStyle=mapStyle? styles[mapStyle]:styles['viewStyle'];

	React.useEffect(() => {
		ol.addMap({
			"target": id,
			"projection": "EPSG:3857",
			"renderer": ["canvas"],
			"zoom": window.systemMain.defaultZoom,
			"center": ol.decodeCoords(window.systemMain.defaultLocation.location, "EPSG:4326", "EPSG:3857"),
			"maxZoom": 16
		});

		switch(mapType) {
			case 'vectorTile':
				ol.addLayer({
					"name": "vectorTiles",
					"type": "vectorTile",
					"url": mapSource||window.systemMain.mapSource,
					"active": true,
					"style":mapBaseStyle

				});
				break;
			case 'xyz':
			default:
				ol.addLayer({
					"name": "xyz",
					"type": "xyz",
					"url": mapSource||window.systemMain.mapSource,
					"active": true

				});
				break;
		}
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
			"style": function(feature,resolution) { return mapLayerStyle(feature,resolution,ol);}
		});
		ol.addLayer({
			"name": "home",
			"type": "vector",
			"active": true,
			"style": locationStyle
		});

		// optionals
		if (handleMapClick !== undefined) {
			ol.simpleClick({"clickFunction": handleMapClick});
		}
		if (onZoomChange !== undefined) {
			ol.addResolutionEvent({"changeFunction": onZoomChange});
			const resolution = ol.updateResolution();
			// Force a zoom change
			onZoomChange(resolution);

		}
		if (onFeatureSeleted !== undefined) {
			ol.makeControl({"layers": ["data"], "selectedFunction": onFeatureSeleted, "multi": true});
		}

	}, [ol]);

	useImperativeHandle(
		ref,
		() => ({
			decodeCoords(flatCoordinates) {
				return ol.decodeCoords(flatCoordinates, 'EPSG:3857', 'EPSG:4326');
			},
			zoomToLayersExtent(layers, buffer) {
				buffer = buffer || window.systemMain.mapBuffer;
				ol.zoomToLayersExtent({"layers": layers, "buffer": buffer});
			},
			zoomToExtent(extent, buffer) {
				buffer = buffer || window.systemMain.mapBuffer;
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
			reset() {
				ol.updateSize();
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
		ol.flyTo({"coordinate": location, "projection": "EPSG:4326", "zoom": window.systemMain.defaultZoom});
	}

	const mapZoomIn = () => {
		ol.animateZoom({inc:+1});
	}

	const mapZoomOut = () => {
		ol.animateZoom({inc:-1});
	}

	const MapSpeedDial = () => {
		if(speedDial===false)
			return <></>;


		return (
			<>
				<Chip color={"primary"} icon={<ZoomInIcon/>}  onClick={mapZoomIn} className={classes.mapZoomInButton}/>
				<Chip color={"primary"} icon={<ZoomOutIcon/>} onClick={mapZoomOut} className={classes.mapZoomOutButton}/>
			</>
		)

	}

	let actualSx={...{
			position: "relative",
			width:"100%",
			height:"100%"
		},...sx};



	return (
		<Box id={id} sx={actualSx}>
			<MapSpeedDial/>
			{window.systemMain.mapAttribution&&
				<div className={classes.mapAttribution}>{window.systemMain.mapAttribution}</div>
			}
		</Box>
	)
});

export default Map;