import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import RenderPlugin from "./renderPlugin";
import MdSerialize from "../../../libs/mdSerialize"
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	ListItem,
	ListItemText,
	Stack,
	TextField
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";

import RenderMarkdown from "./renderMarkdown";

import Button from "@mui/material/Button";
import DialogContentText from "@mui/material/DialogContentText";

import pluginsDefs from "./pluginsDef";
import Grid from "@mui/material/Grid";

export default function EditMarkdown({documentObj, mode, id}) {

	const dispatch = useDispatch();

	const [openPlugin, setOpenPlugin] = useState(false);
	const [plugin, setPlugin] = useState(undefined);


	const MD = new MdSerialize();
	let documentActual = documentObj;
	if (typeof documentObj === "string")
		documentActual = MD.parse(documentObj)

	//console.log(documentActual);
	//const editor = useSelector((state) => state.adminPages.editor);

	const [editor, setEditor] = useState(documentActual);
	useEffect(() => {
		if (editor === undefined)
			setEditor(documentActual)
		//dispatch(setEditor(documentActual));
		/*	if(position&&position.line)
				setCaretPosition('setCaretPosition',position)*/

	}, [editor]);


	const handleClosePlugin = (e) => {
		setOpenPlugin(false);
	}

	const handleSavePlugin = (e) => {
		setOpenPlugin(false);
	}

	const handleDeletePlugin = (e) => {
		setOpenPlugin(false);
		let element = document.querySelector(`[data-oid="${plugin.oid}"]`);
		element.remove();
		setOpenPlugin(false);
	}


	function pluginClick(e) {
		console.log(e);
		setPlugin({name: e.target.dataset.plugin, params: e.target.dataset.params, oid: e.target.dataset.oid});
		setOpenPlugin(true);

		//debugger;
	}

	const pressPlugin = (plugin) => {
		/*
			let element=document.getElementById("EditorHTML");
			let obj=MD.parseHTML(element);
			setEditor(obj);
		*/
		document.execCommand("insertHTML", false, `<div>${plugin}</div>`);
		let selectedElement = window.getSelection().focusNode.parentNode;
		selectedElement.style.border = "1px solid black";
		selectedElement.style.padding = "5px";
		selectedElement.style.borderRadius = "5px";
		selectedElement.style.margin = "10px";
		selectedElement.style.background = "lightgreen";
		selectedElement.setAttribute('data-params', "foo=\"bar\"");
		selectedElement.setAttribute('data-plugin', plugin);
		selectedElement.setAttribute('data-oid', -1);
		selectedElement.addEventListener('click', pluginClick);
		document.execCommand("insertHTML", false, `<div><br/></div>`);

	}

	function RenderStyles() {
		let styleArray = [];
		for (let style in window.systemMain.styles) {
			styleArray.push(
				<Button variant={"contained"} onClick={() => {
					pressStyle(style)
				}}>{style}</Button>
			)

		}
		return styleArray;
	}

	function RenderPluginButtons() {
		let buttonsArray = [];
		for (let p in pluginsDefs) {
			buttonsArray.push(
				<Button variant={"outlined"} onClick={() => {
					pressPlugin(p)
				}}>{p} {pluginsDefs[p].description}</Button>
			)
		}
		return buttonsArray;

	}


	return (
		<Box sx={{
			width: "1200px"
		}}>
			<Box>
				<Grid container>
					<Grid item>
						<Button variant={"outlined"} onClick={() => {
							pressHeader('h1')
						}}>h1</Button>
						<Button variant={"outlined"} onClick={() => {
							pressHeader('h2')
						}}>h2</Button>
						<Button variant={"outlined"} onClick={() => {
							pressHeader('h3')
						}}>h3</Button>
						<Button variant={"outlined"} onClick={() => {
							pressHeader('h4')
						}}>h4</Button>
						<Button variant={"outlined"} onClick={() => {
							pressBold()
						}}>BOLD</Button>
						<Button variant={"outlined"} onClick={() => {
							pressItalic()
						}}>Italic</Button>
						<Button variant={"outlined"} onClick={() => {
							pressHR()
						}}>HR</Button>
						<Button variant={"outlined"} onClick={() => {
							pressClearFormatting()
						}}>Clear format</Button>
					</Grid>
					<Grid item>
						<RenderPluginButtons/>
					</Grid>
					<Grid item>
						<RenderStyles/>
					</Grid>
				</Grid>

			</Box>
			<Box id={id} onKeyDown={(e) => {
			}} sx={{
				border: "1px solid black",
				width: "100%",
				height: "500px",
				whiteSpace: "pre",
				padding: "5px",
				overflow: "scroll",
			}} contentEditable={true}
			><br/>{mode === 'wysiwyg' ?
				<RenderMarkdown markdown={editor} mode={"editor"} clickFunction={pluginClick}/> : MD.stringify(editor)}
			</Box>

			<Dialog open={openPlugin} onClose={handleClosePlugin}>
				<DialogTitle>Edit plugin [{plugin ? plugin.name : 'not set'}]</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<RenderPluginForm plugin={plugin}/>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button color="warning" onClick={handleClosePlugin}>Cancel</Button>
					<Button color="success" onClick={handleSavePlugin}>Save</Button>
					<Button color="error" onClick={(e) => {
						handleDeletePlugin(e)
					}}>Delete</Button>

				</DialogActions>
			</Dialog>
		</Box>

	);

}

function RenderPluginForm({plugin}) {

	const [params, setParams] = useState(plugin.params)

	return (<>
		<TextField
			margin="dense"
			id="params"
			label="Params"
			type="text"
			fullWidth
			variant="standard"
			value={params}
			onChange={(e) => {
				setParams(e.target.value)
			}}
		/>
	</>)
}




function pressClearFormatting() {
	document.execCommand("removeFormat", false, "");
	let selectedElement = window.getSelection().focusNode.parentNode;
	selectedElement.setAttribute('data-style', "");

}

function pressHR() {
	document.execCommand("insertHTML", false, "<hr>");
}

function pressBold() {
	document.execCommand('bold', false);
}

function pressItalic() {
	document.execCommand('italic', false);
}

function pressHeader(command) {
	document.execCommand('formatBlock', false, command);
}

function pressStyle(style) {
	document.execCommand("copy", false, "");
	let selectedElement = window.getSelection().focusNode.parentNode;
	if (window.systemMain.styles[style] && window.systemMain.styles[style].color)
		selectedElement.style.color = window.systemMain.styles[style].color;
	else
		selectedElement.style.color = '';
	selectedElement.setAttribute('data-style', style);
}

/* REWRITE OLD CODE

const InputEvent = (e) => {
		return;
		//console.log(e.currentTarget.innerText)
		let pos = getCaretIndex(e.currentTarget);
		let line = getCaretLine(e.currentTarget.innerText, pos);
		setPosition(line);
		console.log(line);
		console.log(e);
		// Added a char
		let current = JSON.parse(JSON.stringify(editor));

		if (e.key.length === 1) {
			if (current[line.line].children[0]) {
				let currentText = current[line.line].children[0].text;
				current[line.line].children[0].text = currentText.slice(0, line.pos + 1) + e.key + currentText.slice(line.pos + 1);
			} else {
				console.log('No child to edit');
			}
			e.preventDefault();
			dispatch(setEditor(current));

		}
		if (e.keyCode === 13) {
			current.splice(line.line + 1, 0, {
				"type": "br"
			});
			e.preventDefault();
			dispatch(setEditor(current));

		}
		//console.log(MD.parse(current));
		//onChange(MD.parse(current));
		//onChange(current);
	}

function MakeLineButtons({json}) {
	let lineButtons = [];
	for (let obj in json) {
		lineButtons.push(<ListItem>
			<ListItemText
				primary={json[obj].type}
			/>
		</ListItem>)
	}
	return lineButtons;
}

function setCaretPosition(id, pos) {
	//debugger;
	let element = document.getElementById("MDEditor");
	let range = document.createRange();
	let sel = window.getSelection();

	range.setStart(element.childNodes[pos.line], 1);
	range.collapse(true);

	sel.removeAllRanges();
	sel.addRange(range);
}
*/

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
	return {line: line - 1, pos: linePos - 2, actual: position};
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


