import React, {useEffect, useState} from 'react';
import {Stack} from "@mui/material";
import Chip from "@mui/material/Chip";
import {setFieldValue} from "../../../redux/slices/formSlice";
import {useDispatch} from "react-redux";

const DataItemModeration = ({dataModeration,id,update}) => {

	const dispatch = useDispatch()

	const [selected,setSelected] = useState(undefined);

	useEffect(() => {
		setSelected(dataModeration[dataModeration.length-1]);
	},[]);
	function handleClick(item) {
		setSelected(item);
		dispatch(setFieldValue({index: id, value: item}));
		update(item);

	}

	return (
		<Stack direction="row" spacing={1}>

			{dataModeration.map((item) => {
				return (
					<Chip
						label={item}
						onClick={()=>handleClick(item)}
						sx = {{
							background: (selected===item? 'green':'blue')
						}}
					/>
				)
			})}
		</Stack>
	)
}

export default DataItemModeration;