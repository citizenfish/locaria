import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import Box from "@mui/material/Box";
import {useDispatch, useSelector} from "react-redux";
import {setSavedAttribute} from "components/redux/slices/userSlice";
export default function UserSearchProfile({ sx }) {

	const dispatch=useDispatch();
	const askQuestions = useSelector((state) => state.userSlice.askQuestions);

	let width = 200;
	let color;
	switch(askQuestions) {
		case 3: //filled
			color="rgba(255,255,255,1)";
			break;
		case 2: //filled
			color="rgba(255,255,255,0.6)";
			break;
		case 1: //filled
			color="rgba(255,255,255,0.4)";
			break;
		case 0: //filled
		default:
			color="rgba(255,255,255,0.1)";
			break;

	}

	function handleReset() {
		dispatch(setSavedAttribute({attribute:"askQuestions",value:0}));
	}

	let actualSx={...sx, ...{
			"height": "200px",
			"width": "200px",
			color: color
	}};

	let boxSx = {
		position: "absolute",
		top: "160px",
		left: `calc( 50% - ${width / 2}px )`,
		width: `${width}px`,
		boxShadow: 3,
		border: "1px solid white"
	}

	return (
		<Box sx={boxSx} onClick={()=>handleReset()}>
			<PersonIcon sx={actualSx}/>
		</Box>
	)
}