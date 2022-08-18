import React, {useRef, useState} from 'react'
import {useDispatch, useSelector} from "react-redux"
import Typography from "@mui/material/Typography"
import Box from"@mui/material/Box"
import Map from "../../../widgets/map"
import Grid from "@mui/material/Grid"
import {FormControl, InputLabel, Input,  Switch, FormGroup,FormControlLabel} from "@mui/material"
import Button from "@mui/material/Button";

export default function ThelistEventsApiEditor(props) {

    const filesConfigured = useSelector((state) => state.apiSelect.filesConfigured)
    const api = useSelector((state) => state.apiSelect.currentSelected)
    const [lon,setLon] = useState(0)
    const [lat,setLat] = useState(0)
    const [radius,setRadius] = useState(10)
    const mapRef = useRef()

    const mapClick = (e) => {

        const geojson={"features": [
                {
                    type: "Feature",
                    geometry: {type: "Point", coordinates:e.coordinate4326},
                    properties: {type : "events_centre"}
                }
            ], type: "FeatureCollection"};

        mapRef.current.addGeojson(geojson,"data",true);
        setLon(e.coordinate4326[0])
        setLat(e.coordinate4326[1])
        mapRef.current.zoomToLayersExtent(["data"])
    }

    return(
        <Box sx={{ height: '800px', width: 1, mt: '40px'}}>
            <Typography>Events API configuration</Typography>
            <Grid container sx={{mt:2}}>
                <Grid item md = {4}>
                    <FormControl sx={{mt:2}}>
                        <InputLabel htmlFor="lon">Longitude of Centre</InputLabel>
                        <Input id="lon"
                               aria-describedby="Longitude of area"
                               value = {lon}
                               type="number"
                               onChange={(e) => {
                            mapClick({
                                coordinate4326 : [parseFloat(e.target.value), lat]
                            })}}/>
                    </FormControl>

                    <FormControl sx={{mt:2}}>
                        <InputLabel htmlFor="lat" >Latitude of Centre</InputLabel>
                        <Input id="lat"
                               aria-describedby="Latitude of area"
                               value={lat}
                               type="number"
                               onChange={(e) => {
                            mapClick({
                                coordinate4326 : [lon,parseFloat(e.target.value)]
                            })}}/>
                    </FormControl>

                    <FormControl sx={{mt:2}}>
                        <InputLabel htmlFor="radius">Radius (miles)</InputLabel>
                        <Input id="radius" aria-describedby="Radius" value={radius}/>
                    </FormControl>

                    <FormControl sx={{mt:2, width:'95%'}}>
                        <InputLabel htmlFor="tags-include">Tags to Include</InputLabel>
                        <Input id="tags-include" aria-describedby="tags-include" />
                    </FormControl>

                    <FormControl sx={{mt:2, width:'95%'}}>
                        <InputLabel htmlFor="tags-exclude">Tags to Exclude</InputLabel>
                        <Input id="tags-exclude" aria-describedby="tags-exclude" />
                    </FormControl>

                    <FormControl sx={{mt:2}}>
                        <FormControlLabel control={<Switch />} label="Disable Events API" />
                    </FormControl>

                </Grid>
                <Grid item md = {8}><Box component="div"
                                         sx={{
                                             p: 2,
                                             mb: 2,
                                             border: '1px solid grey',
                                             borderRadius: '5px',
                                             height: '500px'
                                         }}>
                    <Map ref={mapRef} id = {"thelistapi"} className={"mapView"} handleMapClick={mapClick}/>
                </Box>
                    <Grid item md={4}>
                        <Button variant="outlined"
                                color="success"
                                size="small"
                                onClick={() => {
                                }}>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )

}