import React, {useEffect, useRef, useState} from 'react';
import maplibregl from 'maplibre-gl';
import Box from "@mui/material/Box";


export default function MaplibreGL({sx,zoom,center}) {
	const mapContainer = useRef(null);
	const map = useRef(null);

	let actualSx = {
		...{
			height:"80vh"
		}, ...sx ? sx : {}
	};


	useEffect(() => {
		if (map.current) return; //stops map from intializing more than once
		map.current = new maplibregl.Map({
			container: mapContainer.current,
			style: `https://api.os.uk/maps/vector/v1/vts/resources/styles?key=pwpinLZQQv5Kkwy5fgX0Sc5HSPvrqAGh`,
			center: center||window.systemMain.defaultLocation.location,
			zoom: zoom||10,
			maxZoom: 15,
			transformRequest: url => {
				url += '&srs=3857';
				return {
					url: url
				}
			}
		});

	});

	return (

			<Box sx={actualSx} ref={mapContainer}/>
	)
}