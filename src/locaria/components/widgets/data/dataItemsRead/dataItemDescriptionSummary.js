import React,{useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import {Button,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,Typography} from "@mui/material";
import Divider from "@mui/material/Divider";
import LaunchIcon from "@mui/icons-material/Launch";


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
            display: "flex",
            flexDirection:"column",
            justifyContent:"space-between",
            backgroundColor: "rgba(235,231,231,0.06)"
        },...sx}

    let textLength = options.length || 100;
    let summaryText = data.length > textLength ? `${data.substring(0, textLength)}...` : data

    //TODO too much hard coded sx in here
    return (
        <div>
            <Card sx = {sxActual} variant="outlined">
                <CardContent sx={{maxHeight: "100px"}}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {summaryText}
                    </Typography>

                </CardContent>
                <CardActions disableSpacing={true} sx={{ml:1,mr:1, borderTop: "1px solid #AAA", justifyContent: "flex-end"}}>

                <Button size="small"
                        variant="text"
                        sx = {{color : "rgb(66,66,66)", padding: 0}}
                        onClick={handleOpen}
                        endIcon={<LaunchIcon />}>More</Button>
                </CardActions>
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