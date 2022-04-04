import React from 'react';

import {channels, configs} from 'themeLocaria';
import {useStyles} from "stylesLocaria";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';

import FormControl from '@mui/material/FormControl';


import {useDispatch, useSelector} from "react-redux";
import {openSearchDrawer, clearSearchCategory} from "../../redux/slices/searchDrawerSlice";
import {Divider} from "@mui/material";


const CategorySelect = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch()
	const mode = props.mode || 'panel'

	const categories = useSelector((state) => state.searchDraw.categories);

	const categoryChange = (e) => {
		if(e.target.checked){
			dispatch(openSearchDrawer({categories: [e.target.value]}));
		}
	}


	if(mode === 'list') {

		return (
			<>
				<FormControl sx={{ m: 1, width: 200 }}>
					{
						channels.listChannels().map((channel) => {
							const chan = channels.getChannelProperties(channel)
							if(chan.display !== false){
								return(
									<MenuItem key ={chan.key} value = {chan.category}>
										<Checkbox
											value = {chan.category}
											checked={categories.indexOf(chan.category) !== -1}
											onChange={categoryChange}
										/>
										<Typography variant="body1" className={classes.categorySelectText}>{chan.category}</Typography>
									</MenuItem>
								)
							}

							})
					}
				</FormControl>
				<Divider/>
				<Typography variant="body1"
							className={classes.resetCategorySelectText}
							onClick={() => {dispatch(clearSearchCategory())}}
							sx={{m:1}}
				>
					{configs.resetCategoryText}
				</Typography>
			</>
		)
	}
	return (
			<>
				<Box className={classes.channelCallToAction}
					display="flex"
					flexDirection="column"
					justifyContent="center"
					alignItems="center">
					<Typography variant="body1" component="div" style = {{color: "black"}}>{configs.channelCallToAction}</Typography>
				</Box>
				<Grid container className={classes.root} spacing={2} justifyContent="center">
					{channels.listChannels().map( (channel) => {
							const chan = channels.getChannelProperties(channel);
							if (chan.display !== false) {
								return (
									<Grid item md={configs.homeGrid} className={classes.channel} key={chan.key} onClick={() => {dispatch(openSearchDrawer({categories: [channel]}));}}>
										<div className={classes.channelPod}>
											<img src={chan.image}/>
											<Typography gutterBottom variant="h5" component="h2"
														style={{color: `${chan.color}`}}>
												{chan.name}
											</Typography>
											<Typography variant="body2" color="textSecondary" component="p" className={classes.channelDescription}>
												{chan.description}
											</Typography>
											<Button size="medium" color="secondary" variant="outlined" onClick={() => { dispatch(openSearchDrawer({categories: [channel]}));}}>
												EXPLORE
											</Button>
										</div>
									</Grid>

								)
							}
						}
					)}
				</Grid>
			</>

	)
}

export default CategorySelect;