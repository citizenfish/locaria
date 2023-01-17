import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import Box from "@mui/material/Box";
import {useDispatch, useSelector} from "react-redux";
import {setSavedAttribute} from "components/redux/slices/userSlice";
export default function UserSearchProfile({ sx }) {

	const dispatch=useDispatch();
	const askQuestions = useSelector((state) => state.userSlice.askQuestions);

	let color;
	switch(askQuestions) {
		case 3: //filled
			color="rgb(42,255,0)";
			break;
		case 2: //filled
			color="rgb(255,222,0)";
			break;
		case 1: //filled
			color="rgb(255,92,0)";
			break;
		case 0: //filled
		default:
			color="rgb(255,0,0)";
			break;

	}

	function handleReset() {
		dispatch(setSavedAttribute({attribute:"askQuestions",value:0}));
		dispatch(setSavedAttribute({attribute:"currentLocation",value: {}}));
		dispatch(setSavedAttribute({attribute:"searchText",value: ""}));
	}

	let actualSx={...sx, ...{
			color: color,
			marginTop: "5px"
	}};

	let boxSx = {
		borderRadius: "20px",
		marginLeft: "10px",
		padding: "5px",
		boxShadow: 3,
		border: "1px solid white"
	}

	return (
		<Box sx={boxSx} onClick={()=>handleReset()}>
			<PersonIcon sx={actualSx}/>
		</Box>
	)
}