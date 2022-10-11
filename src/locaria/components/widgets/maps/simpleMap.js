import React, {useEffect, useRef, useState} from 'react';
import Map from "../maps/map"
import {useDispatch, useSelector} from "react-redux";
import {newSearch, setFeature} from "../../redux/slices/searchDrawerSlice";

export default function SimpleMap ({style,id='SimpleMap',handleMapClick,onZoomChange,speedDial,sx,category,tag,mapType,mapSource,mapStyle,maxZoom,zoom}) {

	const mapRef = useRef();
	const dispatch = useDispatch();
	const features = useSelector((state) => state.searchDraw.features);


	useEffect(() => {
			dispatch(newSearch({categories: category, tags: tag}));
	},[]);

	function onFeatureSeleted(features) {
		dispatch(setFeature(features[0].properties.fid))

	}

	useEffect(() => {
		console.log(features);
		mapRef.current.addGeojson(features)
		mapRef.current.zoomToLayersExtent(["data"], 50000);
	},[features]);

		return (
		<Map style={style} id={id} sx={sx} ref={mapRef} mapType={mapType} mapSource={mapSource} mapStyle={mapStyle} onFeatureSeleted={onFeatureSeleted} zoom={zoom} maxZoom={maxZoom}></Map>
	)

}