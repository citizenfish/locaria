import React,{useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import {Button,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,Typography} from "@mui/material";


const DataItemDescriptionSummary = ({name,data,sx}) => {

    const [open,setOpen] = useState(false)

    const handleClose = () =>{
        setOpen(false)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    let sxActual={...{

            maxHeight: "150px"

        },...sx}

    //TODO 120 in parameters
    let summaryText = data.length > 100 ? `${data.substring(0, 100)}...` : data


    return (
        <div>
            {/*<Button onClick={handleOpen} sx = {sxActual}>{summaryText}</Button>*/}
            <Card sx = {sxActual}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {summaryText}
                    </Typography>
                    <CardActions>
                        <Button size="small" onClick={handleOpen}>Learn More</Button>
                    </CardActions>
                </CardContent>
            </Card>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="description-dialog-title"
                aria-describedby="description-dialog-description"
            >
                <DialogTitle id="description-dialog-title">Description</DialogTitle>
                <DialogContent>
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