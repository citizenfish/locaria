import React from 'react';
import SimpleMap from './simpleMap'
import Grid from "@mui/material/Grid";
import SearchCategory from "../search/searchCategory";
import TextSearchWidget from "../search/textSearchWidget";

export default function SubCatMap ({style,id='SubCatMap',multi=true,handleMapClick,onZoomChange,onFeatureSeleted,speedDial,sx,category,tag,mapType,mapSource,mapStyle,maxZoom}) {
	return (
		<Grid container spacing={2} justifyContent="left" alignItems="top">
			<Grid item md={3} >
				<TextSearchWidget format={"box"}/>
				<SearchCategory multi={multi} category={category}/>
			</Grid>
			<Grid item md={9}>
				<SimpleMap category={category} style={style} id={id} sx={sx} mapType={mapType} mapSource={mapSource} mapStyle={mapStyle} maxZoom={maxZoom}></SimpleMap>
			</Grid>
		</Grid>
	)

}