import React, {useState} from 'react';
import {Stack, TextField} from "@mui/material";

import {useDispatch, useSelector} from "react-redux";
import {setSearch} from "../../redux/slices/searchDrawerSlice";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from '@mui/icons-material/Search';
export default function TextSearchSimple({sx, placeholder}) {
	const dispatch = useDispatch()

	const searchParams = useSelector((state) => state.searchDraw.searchParams);

	const [localSearch, setLocalSearch] = useState(searchParams.search);

	let elementSx = {
		...{
			padding: "0px",
			marginTop: "5px",
			width: "100%"
		}, ...sx || {}
	};

	function updateSearch() {
		dispatch(setSearch({search: localSearch}));

	}


	return (
		<Stack spacing={2} direction="row">
			<TextField variant="outlined" label="Search" id={"textSearchWidget"} value={localSearch} onChange={(e)=>{setLocalSearch(e.target.value)}} sx={elementSx}
					   onKeyUp={(e) => {
						   if (e.keyCode === 13)
							   updateSearch();
					   }}
					   placeholder={placeholder || ''}
					   InputProps={{
						   startAdornment: (
							   <InputAdornment position="start">
								   <SearchIcon onClick={updateSearch} sx={{
									   cursor: "pointer"
								   }}/>
							   </InputAdornment>
						   ),
					   }}
			/>
		</Stack>
	)


}