import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import RenderPlugin from "./renderPlugin";
import MdSerialize from "../../../libs/mdSerialize"
import {
	ButtonGroup,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";

import RenderMarkdown from "./renderMarkdown";

import Button from "@mui/material/Button";
import DialogContentText from "@mui/material/DialogContentText";

import pluginsDefs from "./pluginsDef";
import Grid from "@mui/material/Grid";
import ArgsSerialize from "../../../libs/argsSerialize";
import {setObjectWithPath} from "../../../libs/objectTools";


export default function EditMarkdown({documentObj, mode, id,simple=false,updateFunction}) {

	const dispatch = useDispatch();

	const [openPlugin, setOpenPlugin] = useState(false);
	const [plugin, setPlugin] = useState(undefined);
	const [showPlugins, setShowPlugins] = useState(false)
	const [showStyles, setShowStyles] = useState(false)

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
		debugger;
		const ARGS=new ArgsSerialize();

		let params=document.getElementById('params').value
		params=ARGS.escapeStringArgs(params);
		setOpenPlugin(false);
		plugin.target.setAttribute('data-params', params );

	}

	const handleDeletePlugin = (e) => {
		setOpenPlugin(false);
		let element = document.querySelector(`[data-oid="${plugin.oid}"]`);
		element.remove();
		setOpenPlugin(false);
	}


	function pluginClick(e) {
		console.log(e);
		setPlugin({name: e.target.dataset.plugin, params: e.target.dataset.params, oid: e.target.dataset.oid,target:e.target});
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

		// Plugins should not be embeded in anything else, so if they are we kill it
		let outer=selectedElement.parentNode;
		let hasOuter = outer.id;
		if(hasOuter==="") {
			outer.parentNode.insertBefore(outer.firstChild,
				outer);
			outer.remove();
		}

		document.execCommand("insertHTML", false, `<div><br/></div>`);

	}

	function RenderStyles() {
		let styleArray = [];
		for (let style in window.systemMain.styles) {
			styleArray.push(
				<Grid item md={2}>
				<Button variant={"outlined"}
						color={"warning"}
						sx={{width:'100%'}}
						onClick={() => {pressStyle(style)}}>
					{style}
				</Button>
				</Grid>
			)

		}
		return styleArray;
	}

	function RenderPluginButtons() {
		let buttonsArray = [];
		for (let p in pluginsDefs) {
			buttonsArray.push(
				<Grid item md={2}>
					<Button variant={"outlined"}
							color={"success"}
							sx={{width:'100%'}}

							onClick={() => {pressPlugin(p)}}>
						{p}
					</Button>
				</Grid>
			)
		}
		return buttonsArray;

	}


	return (
		<Box sx={{
			width: "100%"
		}}>
			<Box>
				<Grid container
					  sx={{ mt:2, mb:2}}
				>
					<Grid item>
						<ButtonGroup variant="text" >
							<Button  onClick={() => {
								pressHeader('h1')
							}}>h1</Button>
							<Button onClick={() => {
								pressHeader('h2')
							}}>h2</Button>
							<Button  onClick={() => {
								pressHeader('h3')
							}}>h3</Button>
							<Button  onClick={() => {
								pressHeader('h4')
							}}>h4</Button>
						</ButtonGroup>
						<ButtonGroup variant="text"
									 sx={{ml:2}}
						>
							<Button onClick={() => {pressBold()}}>
								Bold
							</Button>
							<Button  onClick={() => {pressItalic()}}>
								Italic
							</Button>
							<Button  onClick={() => {pressHR()}}>
								HR
							</Button>
						</ButtonGroup>
						{simple === false &&
							<ButtonGroup>


								<Button sx={{ml: 2}}
										variant={"text"}
										color={"success"}
										onClick={() => {
											setShowPlugins(!showPlugins)
										}}
								>
									{showPlugins === false ? 'Plugins' : 'Hide Plugins'}

								</Button>
								<Button sx={{ml: 2}}
										variant={"text"}
										color={"warning"}
										onClick={() => {
											setShowStyles(!showStyles)
										}}
								>
									{showStyles === false ? 'Styles' : 'Hide Styles'}

								</Button>
							</ButtonGroup>
						}
						<Button variant={"text"}
								color="error"
								onClick={() => {pressClearFormatting()}}
								sx={{ml:2}}>
							Clear formatting
						</Button>
					</Grid>
					{showPlugins &&
						<Box sx={{borderRadius:1, backgroundColor:'#F7F7F7', p:1, mt:2}}>
							<Grid container
								  spacing={2}
							>
								 <RenderPluginButtons/>
							</Grid>
						</Box>
					}
					{showStyles &&
						<Box sx={{borderRadius:1, backgroundColor:'#F5E5E5', p:1, mt:2}}>
							<Grid container
								  spacing={2}>
								 <RenderStyles/>
							</Grid>
						</Box>
					}
				</Grid>

			</Box>
			<Box id={id}
				 onKeyUp={(e) => {
					if(updateFunction) {
						let element=document.getElementById(id);
						let obj=MD.parseHTML(element);
						updateFunction(obj);
					}
				 }}
				 sx={{
						border: "1px solid black",
					 	width: 'calc(100vw - 300px)',
						height: "500px",
						whiteSpace: "pre",
						padding: 2,
						overflow: "scroll",
					 	boxShadow: 2,
					 	borderRadius: 1,
					 	m:'20px'
					}}
				 contentEditable={true}
				 suppressContentEditableWarning={true}
			><br/>{mode === 'wysiwyg' ?
				<RenderMarkdown markdown={editor}
								mode={"editor"}
								clickFunction={pluginClick}/> : MD.stringify(editor)}
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
	selectedElement.style.color = '';


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


