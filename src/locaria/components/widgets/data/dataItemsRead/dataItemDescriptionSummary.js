import React,{useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import {Button,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,Typography} from "@mui/material";


const DataItemDescriptionSummary = ({name,data,sx,allData,options={}}) => {


    const [open,setOpen] = useState(false)


    const handleClose = () =>{
        setOpen(false)
    }

    const handleOpen = () => {
        console.log(allData)
        setOpen(true)
    }

    let sxActual={...{

            maxHeight: "150px"

        },...sx}

    let textLength = options.length || 100;
    let summaryText = data.length > textLength ? `${data.substring(0, textLength)}...` : data


    return (
        <div>
            <Card sx = {sxActual}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {summaryText}
                    </Typography>
                    <CardActions>
                        <Button size="small" sx ={{color: "rgb(116, 116, 116)"}}onClick={handleOpen}>Details</Button>
                    </CardActions>
                </CardContent>
            </Card>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll = "paper"
                aria-labelledby="description-dialog-title"
                aria-describedby="description-dialog-description"
            >
                <DialogTitle id="description-dialog-title" sx = {{textAlign: "center"}}>{allData.properties.description.title}</DialogTitle>
                <DialogContent dividers>
                    <DialogContentText id="description-dialog-description">
                        {data}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default DataItemDescriptionSummary;