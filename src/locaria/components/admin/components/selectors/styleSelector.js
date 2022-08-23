import {useDispatch, useSelector} from "react-redux";
import {setPage, setStyle} from "../../redux/slices/adminPagesSlice";
import React from "react";
import StripedDataGrid from "../../../widgets/data/stripedDataGrid";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {useHistory} from "react-router-dom";

export default function StyleSelector (props) {
	const style = useSelector((state) => state.adminPages.style);
	const dispatch = useDispatch()
	const history = useHistory();

	const styleActions = (params)=> {
		let style = params.row.name
		return (
			<Grid container>
				<Grid item md={4}>
					<Button variant="outlined"
							color="success"
							size="small"
							onClick={() => {
								dispatch(setStyle(style))
								history.push(`/Admin/Settings/Appearance/Edit`)
							}}>
						Edit
					</Button>
				</Grid>
				<Grid item md={4}>
					<Button variant="outlined"
							color="error"
							size="small"
							onClick={() => {
								dispatch(setStyle(style))
								props.setOpenDelete(true)
							}}>
						Delete
					</Button>
				</Grid>
			</Grid>
		)
	}

	const stylePreview =(params) =>{
		let style = params.row.name
		return(
			<Button variant="outlined"
					color="warning"
					size="small"
					onClick={() => {

					}}>
				Preview
			</Button>
		)
	}

	const columns = [
		{field: "name", headerName: "Style", width: 200},
		{field: "preview", headerName: "Preview", width: 300, renderCell: stylePreview},
		{field: "actions", headerName: "Actions",  width: 300, renderCell: styleActions}
	]

	let styleList = [];
	let count = 0
	for(let s in window.systemMain.styles) {
		styleList.push({
			id: count++,
			name: s
		})
	}

	return (
		<Box sx={{ height: '800px', width: 1, mt: '40px'}}>

			<StripedDataGrid
				columns={columns}
				rows={styleList}
			/>

		</Box>
	)

}

/*
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
 */