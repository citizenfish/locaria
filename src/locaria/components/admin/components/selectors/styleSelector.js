import {useDispatch, useSelector} from "react-redux";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import {InputLabel, Select} from "@mui/material";
import {setStyle} from "../../redux/slices/adminPagesSlice";
import React from "react";

export default function StyleSelector () {
	const style = useSelector((state) => state.adminPages.style);
	const dispatch = useDispatch()

	let styleList = [];
	for(let s in window.systemMain.styles) {
		styleList.push( <MenuItem key={s} value={s}>{s}</MenuItem>)
	}

	return (
		<FormControl style={{minWidth: 400, marginTop: 20}}>
			<InputLabel id="locaria-settings-select-label">Select style</InputLabel>
			<Select
				labelId="locaria-settings-select-label"
				id="locaria-settings-select"
				value={style}
				label="Style"
				onChange={(e) => {
					dispatch(setStyle(e.target.value));
				}}
			>
				{styleList}
			</Select>
		</FormControl>
	)

}