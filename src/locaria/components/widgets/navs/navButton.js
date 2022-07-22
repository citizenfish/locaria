import React from 'react';
import Button from "@mui/material/Button";
import {useHistory} from "react-router-dom";

export default function NavButton({sx,text,mode,url}) {
	const history = useHistory();

	return (
		<Button variant={"contained"} sx={{...{
			marginTop: "10px",
			backgroundColor: window.systemMain.headerBackground,
			borderRadius: "0px",
			paddingLeft: "30px",
			paddingRight: "30px",
				"&:hover": {
					backgroundColor: window.systemMain.headerBackground
				}
		},...sx}}
				onClick={(e) => {
					switch (mode) {
						case 'url':
							history.push(url);
							break;
						case 'forward':
							history.goForward();
							break;
						case 'back':
						default:
							history.goBack();
							break;
					}
				}}>
			{text}
		</Button>
	)
}