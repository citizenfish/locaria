import React, {useState} from 'react';
import Box from "@mui/material/Box";
import RenderPlugin from "./renderPlugin";


export default function EditMarkdown({document, onChange}) {

	const [editor,setEditor]=useState(document);

	const InputEvent = (e) => {
		let current=e.currentTarget.innerText;
		onChange(current);
	}

	const renderElements=(text) => {

		text.replace(/^%(.*?)%/g,<div>PLUGIN</div>);
		return text;
	}

	return (
		<Box onInput={(e) => {
			InputEvent(e);
		}} sx={{
			border: "1px solid black",
			width: "100%",
			height: "500px",
			whiteSpace: "pre",
			padding: "5px"
		}} contentEditable={true}
		>{renderElements(editor)}</Box>
	);
}
