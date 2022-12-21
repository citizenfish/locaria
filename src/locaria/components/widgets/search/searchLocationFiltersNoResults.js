import React from 'react';
import {Stack} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import Button from "@mui/material/Button";
import {useHistory} from "react-router-dom";
import {setDistance} from "../../redux/slices/searchDrawerSlice";
import {distanceFormatNice} from "libs/Distance";
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid";

const SearchLocationFiltersNoResults = () => {

	const searchParams = useSelector((state) => state.searchDraw.searchParams);
	const currentLocation = useSelector((state) => state.searchDraw.currentLocation);
	const dispatch = useDispatch()

	const history = useHistory();

	//TODO make this configurable as image and category is hardcoded

	return (
			<Stack>
				<Box
					component={"img"}
					sx = {{
						width: "100%"
					}}
					src = "http://activeprescriptiondev.myactiveprescription.com/assets/bfa57a48-4c35-4eb2-9fcc-e42bd2b940df.jpg"
				/>


				<p>You searched for <b>{searchParams.categories}</b> within <b>{distanceFormatNice(searchParams.distance *1000, searchParams.distanceType,0)}</b> of <b>{currentLocation&&currentLocation.text ? currentLocation.text:'Your location'}</b> and we have not found any matching results.</p>
				{searchParams.distance < 20 &&
					<Grid container>
						<Grid item md={6}>
							<p>Would you like to try widening the search area</p>
						</Grid>
						<Grid item md ={2}>
							<Button variant={"outlined"}
									onClick={()=>{dispatch(setDistance(20));}}
									sx = {{width: '200px'}}>
								Try {distanceFormatNice(20000,searchParams.distanceType,0)}
							</Button>
						</Grid>
				    </Grid>
				}
				<Grid container>
					<Grid item md={6}>
						<p>We could look for online activities instead?</p>
					</Grid>
					<Grid item md ={2}>
						<Button variant={"outlined"}
								sx = {{width: '200px'}}
								onClick={()=>{history.push("/DoItAtHome/sp/Do%20it%20at%20home")}}>
							Do it at home
						</Button>
					</Grid>
				</Grid>

				<Grid container>
					<Grid item md={6}>
						<p>Or we could start looking all over again</p>
					</Grid>
					<Grid item md ={2}>
						<Button variant={"outlined"}
								sx = {{width: '200px'}}
							 	onClick={()=>{history.push("/")}}>
							{/* TODO reset filters when this is selected*/}
							Home
						</Button>
					</Grid>
				</Grid>


			</Stack>
	)
}

export default SearchLocationFiltersNoResults;
