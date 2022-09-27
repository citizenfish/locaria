import React, {useEffect, useState} from 'react';
import {TextField} from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {useDispatch, useSelector} from "react-redux";
import {setFieldValue, setupField} from "../../../redux/slices/formSlice"
import DataItemsTypography from "./dataItemsTypography";

const DataItemTextInput = ({id, name, data, prompt, multiline=false,required}) => {

	const dispatch = useDispatch()
	const formData = useSelector((state) => state.formSlice.formData);

	const [dataLocal, setDataLocal] = useState(data);

	useEffect(() => {
		dispatch(setupField({index: id, value: data,required:required}))
	},[]);

	return (
		<Grid container spacing={2} sx={{
			marginBottom: "10px"
		}}>
			<Grid item md={4}>
				<DataItemsTypography name={name} prompt={prompt} required={required}/>
			</Grid>
			<Grid item md={8}>
				<TextField
					error={formData[id]? !formData[id].complete:false}
					margin="dense"
					id={id}
					//label={name}
					type="text"
					fullWidth
					variant="outlined"
					inputProps={{
						style: {
							padding: 5
						}
					}}
					value={dataLocal}
					sx={{
						color: "black"
					}}
					multiline={multiline}
					onChange={(e) => {
						setDataLocal(e.target.value);
						dispatch(setFieldValue({index: id, value: e.target.value}))
					}}
				/>
			</Grid>

		</Grid>

	)
}

export default DataItemTextInput;