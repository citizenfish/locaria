import React, {useImperativeHandle} from 'react';
import Button from "@mui/material/Button";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';


import {useStyles} from "stylesLocaria";
import Container from "@mui/material/Container";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const Multi = () => {
	const [open, setOpen] = React.useState(false);
	const [features, setFeatures] = React.useState(undefined);
	const classes = useStyles();

	const openMulti = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};


	useImperativeHandle(
		ref,
		() => ({
			toggleSearchDraw() {
				return toggleSearchDraw();
			},
			openSearchDraw() {
				return openSearchDraw();
			}
		})
	)

	return (

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
			<DialogTitle id="alert-dialog-slide-title">{"Multiple features found"}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-slide-description" component="div">


				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="secondary" variant="outlined">
					Dismiss
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default Multi;