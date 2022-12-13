import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import maplibregl from 'maplibre-gl';
import Box from "@mui/material/Box";
import bboxPolygon from '@turf/bbox-polygon';
import buffer from '@turf/buffer';
import bbox from "@turf/bbox";

const MaplibreGL = forwardRef(({
								   sx,
								   zoom = 15,
								   center,
								   style = '/mapbox/styles.json',
								   bboxUpdate,
								   maxZoom = 20,
								   minZoom = 0,
								   layout = "mapStyleDefault",
								   precision = 7,
								   bboxSet,
								   bboxBuffer=100,
								   pitch = 60
							   }, ref) => {

	const mapContainer = useRef(null);
	const map = useRef(null);
	const [mapActive, setMapActive] = useState(false);
	const [queue, setQueue] = useState([]);

	useEffect(() => {
		return () => {
			map.current.remove();
		}
	}, []);

	let actualSx = {
		...{
			height: "80vh"
		}, ...sx ? sx : {}
	};

	function updateBBOC() {
		if (bboxUpdate) {
			let bounds = map.current.getBounds();
			let bboxArray = [bounds._ne.lng.toFixed(precision), bounds._ne.lat.toFixed(precision), bounds._sw.lng.toFixed(precision), bounds._sw.lat.toFixed(precision)];
			bboxUpdate(bboxArray);
		}
	}

	useEffect(() => {
		let localQueue = [...queue];
		if (mapActive === true) {
			if (localQueue.length > 0) {
				let item = localQueue.shift();
				// proccess stuff
				switch (item.type) {
					case 'addGeojson':
						map.current.getSource(item.id).setData(item.geojson);
						break;
				}
				setQueue(localQueue);
			}
		}
	}, [queue, mapActive]);

	useEffect(() => {
		if (map.current) return; //stops map from intializing more than once

		// default params for the map
		let options = {
			container: mapContainer.current,
			style: style,
			maxZoom: maxZoom,
			minZoom: minZoom,
			pitch: pitch,
		}

		if (bboxSet) {
			let bboxBuffered=bboxSet;

			if(bboxBuffer){
				const bboxPolly=bboxPolygon(bboxSet);
				const tmpBuffered=buffer(bboxPolly, bboxBuffer,{units:"meters"});
				bboxBuffered = bbox(tmpBuffered);
			}
			// Mapbox uses array of point bbox format
			options.bounds = [[bboxBuffered[0], bboxBuffered[1]], [bboxBuffered[2], bboxBuffered[3]]];
			console.log(options.bounds);
		} else {
			options.center = center || window.systemMain.defaultLocation.location;
			options.zoom=zoom;

		}

		map.current = new maplibregl.Map(options);

		//TODO needs CSS stylesheet for control https://maplibre.org/maplibre-gl-js-docs/example/navigation/
		map.current.addControl(new maplibregl.NavigationControl());

		map.current.on('load', function () {
			updateBBOC();
			map.current.loadImage(
				'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
				(error, image) => {
					if (error) throw error;
					map.current.addImage('custom-marker', image);
					setMapActive(true);
				});
			map.current.addSource('data', {
				type: 'geojson',
				data: {features: [], type: "FeatureCollection"}
			});
			/*
			Note that this won't work for some reason with certain fonts
			You will get an error "Unimplemented type: 3"
			I fixed it by chnaging the font to one from https://developers.arcgis.com/javascript/latest/labeling/
			After reading: https://github.com/maplibre/maplibre-gl-js/issues/197 final comment
			 */

			/*
			 To get nested properties you have to next the expression and retrieve from 'properties' object
			 */

			map.current.addLayer({
				id: 'data',
				type: 'symbol',
				source: 'data',
				layout: window.mapStyles[layout].data
			});

			map.current.on('zoomend', () => {
				updateBBOC();
			});

			map.current.on('moveend', () => {
				updateBBOC();
			});

		});



	});

	useImperativeHandle(
		ref,
		() => ({
			addGeojson(geojson, id) {
				setQueue([{"type": "addGeojson", "geojson": geojson, id: id}])

			},
			getLocation() {
				return map.current.getCenter();
			}
		})
	);

	return (
		<Box sx={actualSx} ref={mapContainer}/>
	)
});

export default MaplibreGL;