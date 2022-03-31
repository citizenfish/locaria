import React, {forwardRef} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Dialog} from "@mui/material";
import {useSelector, useDispatch} from 'react-redux'

import {useStyles} from "stylesLocaria";
import {openSearchDraw, setTags} from "../redux/slices/searchDrawSlice";

import {channels, configs} from 'themeLocaria';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FilterDistance from "../search/FilterDistance";
import SearchTags from "../search/SearchTags";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';

const AdvancedAccordion = forwardRef((props, ref) => {

	const classes = useStyles();
	const dispatch = useDispatch()

	const categories = useSelector((state) => state.searchDraw.categories);


	return (
		<Accordion className={classes.searchDrawAdvancedAccordion}>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon/>}
				aria-controls="panel1a-content"
				id="panel1a-header"
			>
				{props.children}
			</AccordionSummary>
			<AccordionDetails className={classes.searchDrawAdvancedAccordionDetails}>
				<Grid container className={classes.root} justifyContent="center">
					<Grid item md={12}>
						<Divider sx={{mb:1}}/>
						<Typography variant="subtitle2" className={classes.searchDrawerAccordianTitle}>Constrain to distance from current location</Typography>
						<FilterDistance/>

					</Grid>
					<Grid item md={12}>
						<Divider sx={{mb:1}}/>
						<Typography variant="subtitle2" className={classes.searchDrawerAccordianTitle}>Choose category for selection</Typography>
						<Grid item md={12} className={classes.channel}>
							<Grid container className={classes.root} spacing={2} justifyContent="center">
								{channels.listChannels().map(function (channel) {
										const chan = channels.getChannelProperties(channel);
										if (chan.display !== false) {
											return (
												<Grid item md={4} className={classes.channel} key={chan.key}>
													<div
														className={categories.indexOf(chan.category) !== -1 ? classes.channelPodSelected : classes.channelPod}
														onClick={() => {
															//dispatch(closeCategoryDraw());
															dispatch(setTags([]));
															dispatch(openSearchDraw({categories: [chan.category]}));
														}}>
														<Typography variant="subtitle2" className={classes.searchDrawerAccordianTitle}>{chan.name}</Typography>

														<img src={chan.image}/>
													</div>
												</Grid>

											)
										}
									}
								)}
							</Grid>
						</Grid>
					</Grid>
					<Grid item md={12}>
						<Divider sx={{mb:1}}/>
						<Typography variant="subtitle2" className={classes.searchDrawerAccordianTitle}>Choose tags for selection</Typography>
						<SearchTags/>
					</Grid>
				</Grid>
			</AccordionDetails>
		</Accordion>
	)
})

export default AdvancedAccordion;
