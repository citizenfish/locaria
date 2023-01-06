import React from 'react';
import Button from "@mui/material/Button";

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {useDispatch, useSelector} from "react-redux";
import {setRecommended} from "components/redux/slices/searchDrawerSlice";
export default function SearchRecommended({sx}) {
	const dispatch = useDispatch()

	const searchParams = useSelector((state) => state.searchDraw.searchParams);


	return (
		<Button onClick={()=>dispatch(setRecommended(!searchParams.sendRecommended))} startIcon={searchParams.sendRecommended? <FavoriteIcon />:<FavoriteBorderIcon/>}>Recommended</Button>
	)
}