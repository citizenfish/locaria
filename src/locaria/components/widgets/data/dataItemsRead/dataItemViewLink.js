import React, {useRef} from 'react';
import Button from "@mui/material/Button";
import CopyAllIcon from '@mui/icons-material/CopyAll';
import Notification from "widgets/utils/notification";

const DataItemViewLink = ({name, data, sx, size = "small"}) => {
	let sxActual = {
		...{
			color: window.systemMain.fontMain,
			margin: "2px"
			//fontSize: "0.5rem"
		}, ...sx
	}

	const ref=useRef();

	return (
		<>
			<Button size={size} variant="text" sx={sxActual} onClick={() => {
				navigator.clipboard.writeText(`${location.protocol}//${location.host}/~${data}`);
				ref.current.open();
			}} endIcon={<CopyAllIcon/>}>{`${name}: ${data}`}</Button>
			<Notification notification={`Copied ${location.protocol}//${location.host}/~${data} to clipboard`} ref={ref}/>
		</>
	)
}

export default DataItemViewLink;