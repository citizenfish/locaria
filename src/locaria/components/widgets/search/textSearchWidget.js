import React, {useEffect, useState} from 'react';
import TypographyHeader from "../typography/typographyHeader";
import {TextField} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {useDispatch, useSelector} from "react-redux";
import {newSearch, setSearch} from "../../redux/slices/searchDrawerSlice";

export default function TextSearchWidget({ sx, heading, placeholder, format = 'full'}) {
	const dispatch = useDispatch()

	const search = useSelector((state) => state.searchDraw.search);

	const mobile = useSelector((state) => state.mediaSlice.mobile);


	let elementSx={
		...{
			padding: "10px",
			marginBottom: "20px"
		}, ...sx || {}
	};

	switch (format) {
		case 'box':
			elementSx.border="1px solid black";
			elementSx.padding="5px";
			return (
				<Box sx={elementSx}>
							<TextField id={"textSearchWidget"} value={search} sx={{
								"& input": {
									color: "black",
									backgroundColor: "white"
								}
							}}
									   onChange={(e) => {
										   dispatch(setSearch({search: e.target.value}));
									   }}
									   placeholder={placeholder || ''} variant="standard"/>
				</Box>
			)
		case 'full':
		default:
			elementSx.backgroundColor=window.systemMain.headerBackground;
			elementSx.width=mobile ? "100%" : "40%";

			return (
				<Box sx={elementSx}>
					<Grid container spacing={2} sx={{
						color: "black"
					}}>
						<Grid item md={5}>
							<TypographyHeader sx={{color: "white"}} element={"h1"}>
								{heading || 'Search'}
							</TypographyHeader>
						</Grid>
						<Grid item md={7}>
							<TextField id={"textSearchWidget"} value={search} sx={{
								"& input": {
									color: "black",
									backgroundColor: "white"
								}
							}}
									   onChange={(e) => {
										   dispatch(setSearch({search: e.target.value}));
									   }}
									   placeholder={placeholder || ''} variant="standard"/>
						</Grid>
					</Grid>
				</Box>
			)
	}


}