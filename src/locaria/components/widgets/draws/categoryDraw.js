import React, {forwardRef} from "react";
import {Dialog} from "@mui/material";
import { useSelector, useDispatch } from 'react-redux'

import {useStyles} from "stylesLocaria";
import {closeCategoryDraw} from "../../redux/slices/categoryDrawSlice";
import {openSearchDraw} from "../../redux/slices/searchDrawSlice";
import Slide from "@mui/material/Slide";

import {channels, configs} from 'themeLocaria';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FilterDistance from "../../search/FilterDistance";


const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const CategoryDraw = forwardRef((props, ref) => {

	const classes = useStyles();
	const dispatch = useDispatch()

	const open = useSelector((state) => state.categoryDraw.open);

	const distance = useSelector((state) => state.searchDraw.distance);


	return (
		<Dialog
			anchor="bottom"
			open={open}
			TransitionComponent={Transition}
			keepMounted
			maxWidth="sm"
			fullWidth={true}
			onClose={() => {
				dispatch(closeCategoryDraw())
			}}
			aria-labelledby="alert-dialog-slide-title"
			aria-describedby="alert-dialog-slide-description"
			className={classes.dialog}
		>
			<Grid container className={classes.root} spacing={2} justifyContent="center">
				<Grid item md={8} className={classes.channel}>
					<h2>Category</h2>
					<Grid container className={classes.root} spacing={2} justifyContent="center">
						{channels.listChannels().map(function (channel) {
								const chan = channels.getChannelProperties(channel);
								if (chan.display !== false) {
									return (
										<Grid item md={4} className={classes.channel} key={chan.key}>
											<div className={classes.channelPod} onClick={() => {
												dispatch(closeCategoryDraw());
												dispatch(openSearchDraw({categories:[chan.category]}));
											}}>
												<Typography>{chan.name}</Typography>

												<img src={chan.image}/>
											</div>
										</Grid>

									)
								}
							}
						)}
					</Grid>
				</Grid>
				<Grid item md={4}>
					<h2>Advanced</h2>
					<FilterDistance></FilterDistance>
				</Grid>
			</Grid>
		</Dialog>
	)
})

export default CategoryDraw;
