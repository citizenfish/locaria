import React, { useRef, useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import {Button,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,Typography} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import MaplibreGL from "widgets/maps/maplibreGL";


const DataItemDescriptionSummary = ({data,sx,allData,length=100}) => {

    const mapRef = useRef();

    const [open,setOpen] = useState(false)

    const handleClose = () =>{
        setOpen(false)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    let sxActual={...{
            display: "flex",
            flexDirection:"column",
            justifyContent:"space-between",
            backgroundColor: "rgba(235,231,231,0.06)"
        },...sx}

    let textLength = length;

    let summaryText='';

    if(typeof data === 'string') {
        summaryText = data.length > textLength ? `${data.substring(0, textLength)}...` : data
    }

    let geojson={
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: allData.geometry.coordinates
                },
                //TODO go back to allData.properties this is in for demo purposes
                properties: {description: {title: `${allData.properties.description.title} at ${allData.properties.data.event_location}`}}

            }
        ]
    };

    //TODO too much hard coded sx in here
    return (
        <>
            <Card sx={sxActual} variant="outlined">
                <CardContent>
                    <Typography sx={{ fontSize: 14,maxHeight: "90px" , overflow: "hidden"}} color="text.secondary" gutterBottom>
                        {summaryText}
                    </Typography>

                </CardContent>
                <CardActions disableSpacing={true} sx={{ borderTop: "1px solid #AAA", justifyContent: "flex-end", backgroundColor: "rgba(204,212,212,0.2)"}}>
                <Button size="small"
                        variant="text"
                        sx = {{color : "rgb(66,66,66)", padding: 0}}
                        onClick={handleOpen}
                        endIcon={<LaunchIcon />}>More</Button>
                </CardActions>
            </Card>
            <Dialog
                open={open}
                fullWidth={true}
                maxWidth={"xl"}
                onClose={handleClose}
                scroll = "paper"
                aria-labelledby="description-dialog-title"
                aria-describedby="description-dialog-description"
            >
                <DialogTitle id="description-dialog-title" sx = {{textAlign: "center", backgroundColor: "rgba(204,212,212,0.2)"}}>{allData.properties.description.title}</DialogTitle>
                <DialogContent dividers>
                    <DialogContentText id="description-dialog-description" sx={{marginBottom: "10px"}}>
                        {data}
                    </DialogContentText>
                    <MaplibreGL  ref={mapRef}  maxZoom={17} minZoom={12} pitch={60} geojson={geojson} center={allData.geometry.coordinates}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DataItemDescriptionSummary;