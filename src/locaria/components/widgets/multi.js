import React, {forwardRef, useImperativeHandle} from 'react';
import Button from "@mui/material/Button";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';


import {useStyles} from "stylesLocaria";
import Container from "@mui/material/Container";
import SearchDrawCard from "./searchDrawCard";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const Multi = forwardRef((props, ref) => {

//const Multi = ({viewWrapper,mapRef}) => {
	const [open, setOpen] = React.useState(false);
	const [features, setFeatures] = React.useState([]);
	const classes = useStyles();

	const openMulti = () => {
		setOpen(true);
	};

	const closeMulti = () => {
		setOpen(false);
	};


	useImperativeHandle(
		ref,
		() => ({
			openMulti(features) {
				setFeatures(features);
				return  openMulti();
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
			onClose={closeMulti}
			aria-labelledby="alert-dialog-slide-title"
			aria-describedby="alert-dialog-slide-description"
			className={classes.dialog}
		>
			<DialogTitle id="alert-dialog-slide-title">{"Multiple features found"}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-slide-description" component="div">
					{features.map((item, index) => (
						<SearchDrawCard key={index} {...item} viewWrapper={props.viewWrapper}
						                mapRef={props.mapRef} closeWrapper={closeMulti}/>
					))}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={closeMulti} color="secondary" variant="outlined">
					Dismiss
				</Button>
			</DialogActions>
		</Dialog>
	)
})

export default Multi;