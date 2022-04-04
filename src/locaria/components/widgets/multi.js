import React, {forwardRef, useImperativeHandle} from 'react';
import Button from "@mui/material/Button";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

import {useSelector, useDispatch} from 'react-redux'

import {useStyles} from "stylesLocaria";
import SearchDrawerCard from "./drawers/cards/searchDrawerCard";
import {closeMultiSelect} from "../redux/slices/multiSelectSlice";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const Multi = forwardRef((props, ref) => {

	const open = useSelector((state) => state.multiSelect.open);
	const features = useSelector((state) => state.multiSelect.features);

	const classes = useStyles();

	const dispatch = useDispatch()


	return (

		<Dialog
			open={open}
			TransitionComponent={Transition}
			keepMounted
			maxWidth="sm"
			fullWidth={true}
			onClose={()=>{dispatch(closeMultiSelect())}}
			aria-labelledby="alert-dialog-slide-title"
			aria-describedby="alert-dialog-slide-description"
			className={classes.dialog}
		>
			<DialogTitle id="alert-dialog-slide-title">{"Multiple features found"}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-slide-description" component="div">
					{features.map((item, index) => (
						<SearchDrawerCard key={index} {...item} mapRef={props.mapRef} />
					))}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={()=>{dispatch(closeMultiSelect())}} color="secondary" variant="outlined">
					Dismiss
				</Button>
			</DialogActions>
		</Dialog>
	)
})

export default Multi;