import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import RenderPlugin from "./renderPlugin";
import MdSerialize from "../../../libs/mdSerialize"
import {ListItem, ListItemText, Stack} from "@mui/material";
import Chip from "@mui/material/Chip";
import {useDispatch, useSelector} from "react-redux";
import {setEditor} from "../../admin/redux/slices/adminPagesSlice";
import TypographyHeader from "../typography/typographyHeader";
import RenderMarkdown from "./renderMarkdown";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";

export default function EditMarkdown({document, onChange, mode}) {

	const dispatch = useDispatch();
	const [position,setPosition]=useState(undefined);

	const MD = new MdSerialize();
	let documentActual = document;
	if (typeof document === "string")
		documentActual = MD.parse(document)

	//console.log(documentActual);
	const editor = useSelector((state) => state.adminPages.editor);

	//const [editor,setEditor]=useState(documentActual);
	useEffect(() => {
		if (editor === undefined)
			dispatch(setEditor(documentActual));
		if(position&&position.line)
			setCaretPosition('setCaretPosition',position)

	}, [editor]);

	const InputEvent = (e) => {
		//console.log(e.currentTarget.innerText)
		let pos = getCaretIndex(e.currentTarget);
		let line = getCaretLine(e.currentTarget.innerText, pos);
		setPosition(line);
		console.log(line);
		console.log(e);
		// Added a char
		let current = JSON.parse(JSON.stringify(editor));

		if(e.key.length===1) {
			if (current[line.line].children[0]) {
				let currentText = current[line.line].children[0].text;
				current[line.line].children[0].text = currentText.slice(0, line.pos + 1) + e.key + currentText.slice(line.pos + 1);
			} else {
				console.log('No child to edit');
			}
			e.preventDefault();
			dispatch(setEditor(current));

		}
		if(e.keyCode===13) {
			current.splice(line.line+1, 0, {
				"type":"br"
			});
			e.preventDefault();
			dispatch(setEditor(current));

		}
		//console.log(MD.parse(current));
		//onChange(MD.parse(current));
		//onChange(current);
	}


	return (
		<Grid container spacing={2} sx={{marginTop: "20px"}}>
			<Grid item md={2}>
				<List>
					<MakeLineButtons json={editor}/>
				</List>
			</Grid>
			<Grid item md={8}>
				<Box id="MDEditor" onKeyDown={(e) => {
					InputEvent(e);
				}} sx={{
					border: "1px solid black",
					width: "100%",
					height: "500px",
					whiteSpace: "pre",
					padding: "5px",
					overflow: "scroll",
				}} contentEditable={true}
				>{mode === 'wysiwyg' ? <RenderMarkdown markdown={editor} mode={"editor"}/> : MD.stringify(editor)}</Box>
			</Grid>
		</Grid>
	);


}

function MakeLineButtons({json}) {
	let lineButtons=[];
	for(let obj in json) {
		lineButtons.push(<ListItem>
			<ListItemText
				primary={json[obj].type}
			/>
		</ListItem>)
	}
	return lineButtons;
}

function setCaretPosition(id,pos) {
	//debugger;
	let element = document.getElementById("MDEditor");
	let range = document.createRange();
	let sel = window.getSelection();

	range.setStart(element.childNodes[pos.line], 1);
	range.collapse(true);

	sel.removeAllRanges();
	sel.addRange(range);
}

function getCaretLine(text, position) {
	let line = 1;
	let linePos = 1;
	text = text.replace(/\r/, '');
	for (let pos = 0; pos < position; pos++) {
		if (text[pos] === '\n') {
			line++;
			position++;
			linePos = 1;
			//console.log(`\\n[${pos}]`);
		} else {
			linePos++;
			//console.log(`${text[pos]}[${pos}]`);
		}
	}
	return {line: line-1, pos: linePos - 2,actual:position};
}

function getCaretIndex(element) {
	let position = 0;
	const isSupported = typeof window.getSelection !== "undefined";
	if (isSupported) {
		const selection = window.getSelection();
		if (selection.rangeCount !== 0) {
			const range = window.getSelection().getRangeAt(0);
			const preCaretRange = range.cloneRange();
			preCaretRange.selectNodeContents(element);
			preCaretRange.setEnd(range.endContainer, range.endOffset);
			position = preCaretRange.toString().length;
		}
	}
	return position;
}

