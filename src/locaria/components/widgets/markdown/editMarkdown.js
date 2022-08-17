import React, {useState} from 'react';
import Box from "@mui/material/Box";
import RenderPlugin from "./renderPlugin";
import MdSerialize from "../../../libs/mdSerialize"

export default function EditMarkdown({document, onChange,mode}) {

	const MD=new MdSerialize();
	let documentActual=document;
	if(typeof document === "string")
		documentActual=MD.parse(document)

	console.log(documentActual);

	const [editor,setEditor]=useState(documentActual);

	const InputEvent = (e) => {
		let current=e.currentTarget.innerText;
		console.log(MD.parse(current));
		onChange(MD.parse(current));
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
		>{MD.stringify(editor)}</Box>
	);
}
