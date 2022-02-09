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


const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const CategoryDraw = forwardRef((props, ref) => {

	const classes = useStyles();
	const dispatch = useDispatch()

	const open = useSelector((state) => state.categoryDraw.open);

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
				{channels.listChannels().map(function (channel) {
						const chan = channels.getChannelProperties(channel);
						if (chan.display !== false) {
							return (
								<Grid item md={6} className={classes.channel} key={chan.key}>
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
		</Dialog>
	)
})

export default CategoryDraw;
