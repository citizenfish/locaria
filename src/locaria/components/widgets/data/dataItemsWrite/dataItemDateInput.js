import React, {useState} from 'react';
import {TextField} from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {useDispatch} from "react-redux";
import {setFieldValue} from "../../../redux/slices/formSlice"
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import DataItemsTypography from "./dataItemsTypography";

const DataItemDateInput = ({id, name, data, prompt,dataModeration, multiline=false,required,views=["year","month"],inputFormat="MM/YYYY"}) => {

	const dispatch = useDispatch()

	const [dataLocal, setDataLocal] = useState(data);

	return (
		<Grid container spacing={2} sx={{
			marginBottom: "10px"
		}}>
			<Grid item md={4}>
				<DataItemsTypography name={name} prompt={prompt} required={required}/>
			</Grid>
			<Grid item md={8}>
				<DesktopDatePicker
					views={views}
					label={name}
					inputFormat={inputFormat}
					value={dataLocal}
					onChange={(e) =>{
						let formattedDate='';
						for(let v in views) {
							switch(views[v]) {
								case 'year':
									formattedDate+=`${e.$y}`;
									break;
								case 'month':
									formattedDate+=`${e.$M}`;
									break;
								case 'day':
									formattedDate+=`${e.$D}`;
									break;
							}
							if(v<views.length-1)
								formattedDate+='/';
						}
						//let formattedDate=`${e.$M}/${e.$D}/${e.$y}`;
						setDataLocal(e);
						dispatch(setFieldValue({index: id, value: formattedDate,required: required}));
					}}
					renderInput={(params) => <TextField {...params} />}
				/>

			</Grid>

		</Grid>

	)
}

export default DataItemDateInput;