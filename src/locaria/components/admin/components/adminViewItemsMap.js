import React, {useEffect, useState, useRef} from "react"
import Map from '../../widgets/map'
import Box from '@mui/material/Box';

import Button from '@mui/material/Button';

export default function AdminViewItemsMap(props) {

    const mapRef = useRef()
    const [mapData,setMapData] = useState(props.mapData)

    useEffect(() =>{
        mapRef.current.addGeojson(props.mapData.geojson)
        mapRef.current.zoomToLayersExtent(["data"])
    },[mapData])

    return(
                <Box component="div"
                     sx={{
                         p: 2,
                         mb: 2,
                         border: '1px solid grey',
                         borderRadius: '5px',
                         height: '300px',
                         width: '800px'
                     }}

                >
                    <Map ref={mapRef} id={'DataMapperMap'} className={'mapView'} speedDial={false}/>
                </Box>
    )
}