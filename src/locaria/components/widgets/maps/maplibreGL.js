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
								   pitch = 0,
									geojson,
								   boundsGeojson,
								   handleMapClick
							   }, ref) => {

	const mapContainer = useRef(null);
	const map = useRef(null);
	const [mapActive, setMapActive] = useState(false);
	const queue = useRef([]);


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

	function addQueueItem(type,geojson,id,fit) {
		queue.current=[...queue.current,...[{"type": type, "geojson": geojson, id: id,fit:fit}]];
		processQueue();

	}

	function processQueue() {
		if (mapActive === true) {
			if (queue.current.length > 0) {
				for(let i in queue.current) {

					switch (queue.current[i].type) {
						case 'addGeojson':
							map.current.getSource(queue.current[i].id).setData(queue.current[i].geojson);
							if (queue.current[i].fit === true) {
								let bounds = bbox(queue.current[i].geojson);
								map.current.fitBounds(bounds, {padding: 20});
							}
							break;
					}
				}
				queue.current = [];
			}
		}
	}

	useEffect(() => {
		processQueue();
	}, [mapActive]);

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

		if (bboxSet&&Array.isArray(bboxSet)&&bboxSet.length===4) {
			let bboxBuffered;
				const bboxPolly=bboxPolygon(bboxSet);
				const tmpBuffered=buffer(bboxPolly, bboxBuffer,{units:"meters"});
				bboxBuffered = bbox(tmpBuffered);
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

			map.current.addSource('boundary', {
				type: 'geojson',
				data: {features: [], type: "FeatureCollection"}
			});


			if(geojson){
				addQueueItem("addGeojson",geojson,"data");

			}
			if(boundsGeojson){
				addQueueItem("addGeojson",boundsGeojson,"boundary",true);
			}


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

			map.current.addLayer({
				id: 'boundary',
				type: 'line',
				source: 'boundary',
				paint: {
					'line-color': '#0080ff', // blue color fill
				}
			});

			map.current.on('zoomend', () => {
				updateBBOC();
			});

			map.current.on('moveend', () => {
				updateBBOC();
			});

			map.current.on('click', (e) => {
				if(handleMapClick) {
					handleMapClick([e.lngLat.lng, e.lngLat.lat]);
				}
			});

		});



	});

	useImperativeHandle(
		ref,
		() => ({
			addGeojson(geojson, id) {
				addQueueItem("addGeojson",geojson,id);
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