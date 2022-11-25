import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import maplibregl from 'maplibre-gl';
import Box from "@mui/material/Box";

const MaplibreGL = forwardRef(({sx,zoom,center,style='/mapbox/styles.json',bboxUpdate}, ref) => {

	const mapContainer = useRef(null);
	const map = useRef(null);
	const [mapActive,setMapActive] = useState(false);
	const [queue,setQueue] = useState([]);


	let actualSx = {
		...{
			height:"80vh"
		}, ...sx ? sx : {}
	};

	function updateBBOC() {
		if(bboxUpdate) {
			let bounds=map.current.getBounds();
			bboxUpdate(bounds);
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
			zoom: zoom||10,
			maxZoom: 26,
			/*transformRequest: url => {
				url += '&srs=3857';
				return {
					url: url
				}
			}*/
		});

		map.current.on('load', function() {
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
			map.current.addLayer({
				'id': 'data',
				'type': 'symbol',
				'source': 'data',
				'layout': {
					'icon-image': 'custom-marker',
					'text-field': ['get', 'title'],
					'text-font': [
						'Open Sans Semibold',
						'Arial Unicode MS Bold'
					],
					'text-offset': [0, 1.25],
					'text-anchor': 'top'
				}
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