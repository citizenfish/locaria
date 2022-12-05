import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import maplibregl from 'maplibre-gl';
import Box from "@mui/material/Box";

const MaplibreGL = forwardRef(({sx,zoom=15,center,style='/mapbox/styles.json',bboxUpdate,maxZoom=26,layout="mapStyleDefault",precision=5}, ref) => {

	const mapContainer = useRef(null);
	const map = useRef(null);
	const [mapActive,setMapActive] = useState(false);
	const [queue,setQueue] = useState([]);

	useEffect(() => {
		return () => {
			map.current.remove();
		}
	},[]);

	let actualSx = {
		...{
			height:"80vh"
		}, ...sx ? sx : {}
	};

	function updateBBOC() {
		if(bboxUpdate) {
			let bounds=map.current.getBounds();
			let bboxArray=[bounds._ne.lng.toFixed(precision),bounds._ne.lat.toFixed(precision),bounds._sw.lng.toFixed(precision),bounds._sw.lat.toFixed(precision)];
			bboxUpdate(bboxArray);
		}
	}

	useEffect(() => {
		let localQueue=[...queue];
			if(mapActive===true) {
				if (localQueue.length > 0) {
					let item=localQueue.shift();
					// proccess stuff
					switch (item.type) {
						case 'addGeojson':
							map.current.getSource(item.id).setData(item.geojson);
							break;
					}
					setQueue(localQueue);
				}
			}
	},[queue,mapActive]);

	useEffect(() => {
		if (map.current) return; //stops map from intializing more than once
		map.current = new maplibregl.Map({
			container: mapContainer.current,
			style: style,
			center: center||window.systemMain.defaultLocation.location,
			zoom: zoom,
			maxZoom: maxZoom,
			/*transformRequest: url => {
				url += '&srs=3857';
				return {
					url: url
				}
			}*/
		});

		map.current.on('load', function() {
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
				data: {features:[],type:"FeatureCollection"}
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
		});

		map.current.on('zoomend', (e) => {
			updateBBOC();
		});

		map.current.on('moveend', (e) => {
			updateBBOC();
		});

	});

	useImperativeHandle(
		ref,
		() => ({
			addGeojson(geojson,id) {
				setQueue([{"type":"addGeojson","geojson":geojson,id:id}])

			}
		})
	);

	return (
			<Box sx={actualSx} ref={mapContainer}/>
	)
});

export default MaplibreGL;