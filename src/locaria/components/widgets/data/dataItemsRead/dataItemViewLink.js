import React, {useRef} from 'react';
import Button from "@mui/material/Button";
import CopyAllIcon from '@mui/icons-material/CopyAll';
import Notification from "widgets/utils/notification";
import Typography from "@mui/material/Typography";

const DataItemViewLink = ({ data, sx, size = "small",mode="copy"}) => {
	let sxActual = {
		...{
			color: window.systemMain.fontMain,
			margin: "2px"
			//fontSize: "0.5rem"
		}, ...sx
	}

	const ref=useRef();
	let num2=data.length;
	let num1=window.systemMain.shortcodePrefix;
	let combined = (num1 << 4) | num2;
	let base32 = combined.toString(32);


	if(mode==="copy"){
	return (
		<>
			<Button size={size} variant="text" sx={sxActual} onClick={() => {
				navigator.clipboard.writeText(`${location.protocol}//${location.host}/~${data}`);
				ref.current.open();
			}} endIcon={<CopyAllIcon/>}>{`${base32}${data}`}</Button>
			<Notification notification={`Copied ${location.protocol}//${location.host}/~${data} to clipboard`} ref={ref}/>
		</>
	)
		}
	else{
		return (
			<>
				<Typography gutterBottom sx={sxActual}>{`${location.protocol}//${location.host}/~${data}`}</Typography>
			</>
		)
	}
}

export default DataItemViewLink;