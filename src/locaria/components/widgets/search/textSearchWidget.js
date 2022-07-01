import React, {useEffect, useState} from 'react';
import TypographyHeader from "../typography/typographyHeader";
import {TextField} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {useDispatch, useSelector} from "react-redux";
import {newSearch, setSearch} from "../../redux/slices/searchDrawerSlice";

export default function TextSearchWidget({id, sx, heading, placeholder}) {
	const dispatch = useDispatch()

	const [searchString, setSearchString] = useState("");
	const search = useSelector((state) => state.searchDraw.search);
	const [searchId, setSearchId] = useState(undefined);

	useEffect(() => {
		if (id !== searchId) {
			setSearchId(id);
			dispatch(setSearch({search: '', refresh: false}));
		}
	}, [id]);

	let elementSx = {
		...{
			padding: "10px",
			backgroundColor: window.systemMain.headerBackground,
			width: "40%",
			marginBottom: "20px"
		}, ...sx || {}
	};

	return (
		<Box sx={elementSx}>
			<Grid container spacing={2} sx={{
				color: "black"
			}}>
				<Grid item md={4}>
					<TypographyHeader sx={{color:"white"}} element={"h1"}>
						{heading || 'Search'}
					</TypographyHeader>
				</Grid>
				<Grid item md={8}>
					<TextField id={"textSearchWidget"} value={search} sx={{
						"& input": {
							color: "black",
							backgroundColor: "white"
						}
					}}
							   onChange={e => dispatch(setSearch({search: e.target.value}))}
							   placeholder={placeholder || ''} variant="standard"/>
				</Grid>
			</Grid>
		</Box>
	)
}