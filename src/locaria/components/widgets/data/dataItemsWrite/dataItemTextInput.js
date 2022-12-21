import React, {useEffect, useState} from 'react';
import {TextField} from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {useDispatch, useSelector} from "react-redux";
import {setFieldValue, setupField} from "../../../redux/slices/formSlice"
import DataItemsTypography from "./dataItemsTypography";
import DataItemModeration from "./dataItemModeration";

const DataItemTextInput = ({id, name, data, prompt,dataModeration, multiline=false,required}) => {

	const dispatch = useDispatch()
	const formData = useSelector((state) => state.formSlice.formData);

	const [dataLocal, setDataLocal] = useState(data);

	useEffect(() => {
		dispatch(setupField({index: id, value: data,required:required}))
	},[]);

	return (
		<Grid container alignItems="stretch" spacing={2} sx={{
			marginBottom: "10px",
		}}>
			<Grid item md={4} xs={12}>
				<DataItemsTypography name={name} prompt={prompt} required={required}/>
			</Grid>
			<Grid item md={8} xs={12}>
				<DataItemModeration dataModeration={dataModeration} id={id} update={setDataLocal}></DataItemModeration>
				<TextField
					error={formData[id]? !formData[id].complete:false}
					margin="dense"
					id={id}
					//label={name}
					type="text"
					variant="outlined"
					inputProps={{
						style: {
							padding: 5
						}
					}}
					value={dataLocal}
					sx={{
						color: "black",
						width: "100%"
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