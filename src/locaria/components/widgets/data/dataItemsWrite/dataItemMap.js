import React, {useEffect, useRef, useState} from 'react';
import Grid from "@mui/material/Grid";

import {useDispatch, useSelector} from "react-redux";
import {setFieldValue, setupField} from "../../../redux/slices/formSlice";
import Map from "../../maps/map";
import Typography from "@mui/material/Typography";
import DataItemsTypography from "./dataItemsTypography";

const DataItemMap = ({id, name, data,prompt,required,mapSource,mapType,mapStyle,maxZoom,zoom,boundsGeojson,buffer,sx}) => {

	const formData = useSelector((state) => state.formSlice.formData);

	const mapRef = useRef();
	let actualSx={...{
			height: "250px"
		},...sx};

	if(formData[id]&&formData[id].complete===false) {
		actualSx.borderColor="#f00";
		actualSx.borderStyle="solid";
		actualSx.borderWidth="1px";
	}

	useEffect(() => {
		if(data&&data.coordinates) {
			const geojson = {
				"features": [
					{
						type: "Feature",
						geometry: {type: "Point", coordinates: data.coordinates},
						properties: {fid:"location"}
					}
				], type: "FeatureCollection"
			};
			mapRef.current.addGeojson(geojson, "data", true);
			dispatch(setupField({index: id, value: `SRID=4326;POINT(${data.coordinates[0]} ${data.coordinates[1]})`,required:required}))

 		} else {
			dispatch(setupField({index: id, value: undefined, required: required}))
		}
	},[]);



	const mapClick = (e) => {
		//debugger;
		const geojson = {
			"features": [
				{
					type: "Feature",
					geometry: {type: "Point", coordinates: e.coordinate4326},
					properties: {}
				}
			], type: "FeatureCollection"
		};
		mapRef.current.addGeojson(geojson, "data", true);
		dispatch(setFieldValue({index: 'geometry', value: e.ewkt}))
		console.log(e.ewkt);
		//setPoint(e.ewkt);

	}
	const dispatch = useDispatch()

	//const [selected, setSelected] = React.useState([]);

	return (
		<Grid container spacing={2} sx={{marginBottom: "10px"}}>
			<Grid item md={4}>
				<DataItemsTypography name={name} prompt={prompt} required={required}/>
			</Grid>
			<Grid item md={8}>
				<Map id={"dropMap"}
					 speedDial={true}
					 sx={actualSx}
					 ref={mapRef}
					 handleMapClick={mapClick}
					 mapSource={mapSource}
					 mapType={mapType}
					 mapStyle={mapStyle}
					 maxZoom={maxZoom}
					 zoom={zoom}
					 boundsGeojson={boundsGeojson}
					 buffer={buffer}
					 />
			</Grid>

		</Grid>

	)
}


export default DataItemMap;