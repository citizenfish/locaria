import React from 'react';
import Button from "@mui/material/Button";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import {useStyles} from "stylesLocaria";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const Share = () => {
	const [open, setOpen] = React.useState(false);
	const classes = useStyles();

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Button disableElevation color="secondary" onClick={handleClickOpen} variant="contained" className={classes.ReportShareButton}>
				Share
			</Button>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				maxWidth="sm"
				fullWidth={true}
				onClose={handleClose}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
				className={classes.dialog}

			>
				<DialogTitle id="alert-dialog-slide-title">{"Share this page"}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description" component="div">

						<Grid container className={classes.root} spacing={2}>
							<Grid item xs={12}>
								<FormControl fullWidth>
									<TextField id="outlined-basic" label="Link" variant="outlined"
									           value={window.location.href} className={classes.dialogInput}/>
								</FormControl>
							</Grid>
							<Grid item md={2}>
								<AssignmentIcon color="secondary" fontSize="large" onClick={() => {
									navigator.clipboard.writeText(window.location.href)
								}}></AssignmentIcon>
							</Grid>
							<Grid item md={2}>
								<TwitterIcon color="secondary" fontSize="large" onClick={() => {
									window.location = `https://twitter.com/intent/tweet?text=${window.location.href}`
								}}></TwitterIcon>
							</Grid>
							<Grid item md={2}>
								<FacebookIcon color="secondary" fontSize="large" onClick={() => {
									window.location = `http://www.facebook.com/share.php?u=${window.location.href}`
								}}></FacebookIcon>
							</Grid>
							<Grid item md={2}>
								<LinkedInIcon color="secondary" fontSize="large" onClick={() => {
									window.location = `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`
								}}></LinkedInIcon>
							</Grid>
						</Grid>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="secondary" variant="outlined">
						Dismiss
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}

export default Share;