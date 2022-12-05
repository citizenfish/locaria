import React from 'react';
import {Stack} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import Button from "@mui/material/Button";
import {useHistory} from "react-router-dom";
import {setDistance} from "../../redux/slices/searchDrawerSlice";

const SearchLocationFiltersNoResults = () => {

	const searchParams = useSelector((state) => state.searchDraw.searchParams);
	const currentLocation = useSelector((state) => state.searchDraw.currentLocation);
	const distanceType = useSelector((state) => state.searchDraw.distanceType);
	const dispatch = useDispatch()


	const history = useHistory();


	return (
			<Stack>
				<p>You searched for <b>{searchParams.categories}</b> within {searchParams.distance}{distanceType} of <b>{currentLocation&&currentLocation.text? currentLocation.text:'Your location'}</b> and we have not found any matching results.</p>
				{searchParams.distance < 20 &&
					<>
						<p>Would you like to try increasing the distance to </p>
						<Button variant={"outlined"} onClick={()=>{
							dispatch(setDistance(20));
						}}>20{distanceType}</Button>
					</>
				}
				<p>Or we could look for online activities instead?</p>
				<Button variant={"outlined"} onClick={()=>{
					history.push("/DoItAtHome/sp/Do%20it%20at%20home")
				}}>
					Do it at home
				</Button>
				<Button variant={"outlined"} onClick={()=>{
					history.push("/")
				}}>
					Home
				</Button>
			</Stack>
	)
}

export default SearchLocationFiltersNoResults;
