import React from 'react';
import Button from "@material-ui/core/Button";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import AssignmentIcon from '@material-ui/icons/Assignment';
import TwitterIcon from '@material-ui/icons/Twitter';
import FacebookIcon from '@material-ui/icons/Facebook';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import { useStyles} from "../../theme/locus";
import Grid from "@material-ui/core/Grid";

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
			<Button size="small" color="primary" onClick={handleClickOpen}>
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
			>
				<DialogTitle id="alert-dialog-slide-title">{"Share this page"}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">

						<Grid container className={classes.root} spacing={2}>
							<Grid item xs={12}>
								<FormControl fullWidth>
									<TextField id="outlined-basic" label="Link" variant="outlined" value={window.location.href} />
								</FormControl>
							</Grid>
							<Grid item md={2}>
								<AssignmentIcon color="secondary" fontSize="large" onClick={() => {navigator.clipboard.writeText(window.location.href)}}></AssignmentIcon>
							</Grid>
							<Grid item md={2}>
								<TwitterIcon color="secondary" fontSize="large" onClick={() => {window.location=`https://twitter.com/intent/tweet?text=${window.location.href}`}}></TwitterIcon>
							</Grid>
							<Grid item md={2}>
								<FacebookIcon color="secondary" fontSize="large" onClick={() => {window.location=`http://www.facebook.com/share.php?u=${window.location.href}`}}></FacebookIcon>
							</Grid>
							<Grid item md={2}>
								<LinkedInIcon color="secondary" fontSize="large" onClick={() => {window.location=`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`}}></LinkedInIcon>
							</Grid>
						</Grid>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Dismiss
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}

export default Share;