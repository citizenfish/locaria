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

import {useStyles} from "stylesLocaria";
import Grid from "@mui/material/Grid";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const Linker = ({location}) => {
	const [open, setOpen] = React.useState(false);
	const classes = useStyles();

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleVisit = () => {
		window.open(location, '_blank').focus();
		setOpen(false);
	};

	return (
		<div>
			<Button size="small" color="secondary" onClick={handleClickOpen} variant="outlined">
				Visit
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
				<DialogTitle id="alert-dialog-slide-title">{"Visit external link?"}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
						<Grid container className={classes.root} spacing={2}>
							<Grid item xs={12}>
								<FormControl fullWidth>
									<TextField id="outlined-basic" label="Link" variant="outlined" value={location} />
								</FormControl>
							</Grid>
						</Grid>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleVisit} color="secondary" variant="outlined">
						Visit
					</Button>
					<Button onClick={handleClose} color="secondary" variant="outlined">
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}

export default Linker;