import React, {useEffect, useRef, useState} from 'react';
import Map from "../maps/map"
import {useDispatch, useSelector} from "react-redux";
import {newSearch} from "../../redux/slices/searchDrawerSlice";

export default function SimpleMap ({style,id='SimpleMap',handleMapClick,onZoomChange,onFeatureSeleted,speedDial,sx,category,tag,mapType,mapSource,mapStyle}) {

	const mapRef = useRef();
	const dispatch = useDispatch();
	const features = useSelector((state) => state.searchDraw.features);


	useEffect(() => {
			dispatch(newSearch({categories: category, tags: tag}));
	},[]);

	useEffect(() => {
		console.log(features);
		mapRef.current.addGeojson(features)
		mapRef.current.zoomToLayersExtent(["data"], 50000);
	},[features]);

		return (
		<Map style={style} id={id} sx={sx} ref={mapRef} mapType={mapType} mapSource={mapSource} mapStyle={mapStyle}></Map>
	)

}