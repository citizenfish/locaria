import React, {useRef} from 'react';
import Button from "@mui/material/Button";
import CopyAllIcon from '@mui/icons-material/CopyAll';
import Notification from "widgets/utils/notification";
import Typography from "@mui/material/Typography";
import QRCode from "react-qr-code";
import {Stack} from "@mui/material";


const DataItemViewLink = ({data, sx, size = "small", mode = "copy"}) => {

	const ref = useRef();

	let sxActual = {
		...{
			color: window.systemMain.fontMain,
			margin: "2px"
			//fontSize: "0.5rem"
		}, ...sx
	}


	function makeShortCode() {
		let num2 = parseInt(data.length, 10);
		let num1 = parseInt(window.systemMain.shortcodePrefix, 10);
		let combined = (num1 << 4) | num2;
		let base32 = combined.toString(32);
		return base32;
	}


	if (mode === "copy") {
		return (
			<>
				<Button size={size} variant="text" sx={sxActual} onClick={() => {
					navigator.clipboard.writeText(`${location.protocol}//${location.host}/~${data}`);
					ref.current.open();
				}} endIcon={<CopyAllIcon/>}>{`${makeShortCode()}${data}`}</Button>
				<Notification notification={`Copied ${location.protocol}//${location.host}/~${data} to clipboard`}
							  ref={ref}/>
			</>
		)
	} else {
		return (
			<Stack alignItems="center">
				<Typography variant={"h6"}  sx={sxActual} gutterBottom>
					Short Code: {`${makeShortCode()}${data}`}
				</Typography>
				<QRCode
					size={256}
					style={{ height: "auto", maxWidth: "150px", width: "150px" }}
					value={`${location.protocol}//${location.host}/~${data}`}
					viewBox={`0 0 256 256`}/>
			</Stack>
		)
	}
}

export default DataItemViewLink;