import React from 'react';
import TypographyHeader from "../typography/typographyHeader";
import TypographyParagraph from "../typography/typographyParagraph";
import RenderPlugin from "./renderPlugin";
import Divider from "@mui/material/Divider";
import UrlCoder from "../../../libs/urlCoder";
import { v4 as uuidv4 } from 'uuid';
import TypographyLink from "../typography/typographyLink";
import TypographyBold from "../typography/typographyBold";
import TypographyItalics from "../typography/typographyItalics";
import {ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
const url = new UrlCoder();
import ArgsSerialize from "../../../libs/argsSerialize";


export default function RenderMarkdown({markdown}) {
	let renderedMarkdown = [];

	// OLD string formatter
	if(typeof markdown === "string") {
		let splitMarkdown = markdown.split('\n');

		for (let line in splitMarkdown) {
			renderedMarkdown.push(ProcessLine(splitMarkdown[line]));
		}
		//debugger;

		return renderedMarkdown;
	} else {
		// NEW Object formatter
		for (let obj in markdown) {
			renderedMarkdown.push(ProcessMDObject(markdown[obj]));
		}
		return renderedMarkdown;
	}
}

function ProcessMDObject(MDObject) {
	// defaults;
	let sx = {};

	if(MDObject.sx!==undefined)
		sx=MDObject.sx;

	if(MDObject.style!==undefined) {
		if(window.systemMain.styles[MDObject.style]) {
			sx = window.systemMain.styles[MDObject.style];
		} else {
			console.info(`${MDObject.style} style is not defined!`);
		}
	}

	switch (MDObject.type) {
		case 'h1':
		case 'h2':
		case 'h3':
		case 'h4':
			sx.marginTop="5px";
			sx.marginBottom="5px";
			return(
				<TypographyHeader sx={sx} element={MDObject.type}
								  key={`md${newUUID()}`}>{MDObject.children[0].text}</TypographyHeader>
			);
		case 'p':
			break;
		case 'plugin':
			return(
				<div key={`md${newUUID()}`}>
					<RenderPlugin plugin={MDObject.plugin} args={MDObject.params}></RenderPlugin>
				</div>
			);

	}
	return (<></>)
}

function RecursiveFormatters(line) {
	let returns=[];
	let matches;

	// Bold **Foo**
	while(matches = line.match(/\*\*(.*?)\*\*/)) {
		returns.push(<span key={`md${newUUID()}`}>{line.slice(0,line.indexOf(matches[0]))}</span>);
		line=line.slice(line.indexOf(matches[0]));
		line=line.replace(matches[0],'');
		returns.push(<TypographyBold sx={{display: "inline-block", }}
									 key={`md${newUUID()}`}>{matches[1]}</TypographyBold>);
	}

	//Italics _Foo_
	while(matches = line.match(/_(.*?)_/)) {
		returns.push(<span key={`md${newUUID()}`}>{line.slice(0,line.indexOf(matches[0]))}</span>);
		line=line.slice(line.indexOf(matches[0]));
		line=line.replace(matches[0],'');
		returns.push(<TypographyItalics sx={{display: "inline-block", }}
									 key={`md${newUUID()}`}>{matches[1]}</TypographyItalics>);
	}

	while(matches=line.match(/\[(.*?)\]\((.*?)\)/)) {
		returns.push(<span key={`md${newUUID()}`}>{line.slice(0,line.indexOf(matches[0]))}</span>);
		line=line.slice(line.indexOf(matches[0]));
		line=line.replace(matches[0],'');
		returns.push(
			<TypographyLink key={`md${newUUID()}`} sx={{display: "inline-block"}} link={matches[2]}>{matches[1]}</TypographyLink>
		);
	}


	if(line.length>0)
		returns.push(<span key={`md${newUUID()}`}>{line}</span>);

	return returns;
}

function newUUID() {
	return uuidv4();

}


// Depreciated
function ProcessLine(line) {
	const ARGS=new ArgsSerialize();

	// Clean any formatters

	line = line.replace(/\r/, '');

	// extract any SX params first for the line  {"foo":"bar"}

	let sxMatch = line.match(/^\{(.*?)\}/);
	let sx = {};
	if (sxMatch !== null) {
		sx = JSON.parse(sxMatch[0]);
		line = line.replace(sxMatch[0], '');
	}

	// Find any replace style tags  &STYLE&
	let tagMatch = line.match(/^\&(.*?)\&/);
	if (tagMatch !== null) {
		sx = window.systemMain.styles[tagMatch[1]];
		line = line.replace(tagMatch[0], '');
	}

	// let match the normal MD
    // First single line formatters (IE ones that can have no further formatting

	// Blank line
	if (line === "") {
		return(
			<TypographyParagraph sx={{display:"block"}} key={`md${newUUID()}`}></TypographyParagraph>
		);
	}
	// Headers IE H1 H2 etc
	let match = line.match(/^#+ /);
	if (match) {
		let headerType = match[0].length - 1;
		let cleanedMatch = line.replace(match[0], '');
		sx.marginTop="5px";
		sx.marginBottom="5px";
		return(
			<TypographyHeader sx={sx} element={"h" + headerType}
							  key={`md${newUUID()}`}>{cleanedMatch}</TypographyHeader>
		);
	}

	// Plugins our format %%
	match = line.match(/^%(.*?)%/);
	if (match) {
		const pluginMatch = match[1].match(/^([a-zA-Z]*)\s{0,1}/);
		let pluginArgStr = match[1].replace(pluginMatch[0], '');
		let pluginArgs=ARGS.parse(pluginArgStr);
		return(
			<div key={`md${newUUID()}`}>
				<RenderPlugin plugin={pluginMatch[1]} args={pluginArgs}></RenderPlugin>
			</div>
		);
	}

	// HR to <Dividor>
	match = line.match(/^----------/);
	if (match) {
		return(
			<Divider sx={{marginTop:"10px",marginBottom:"10px"}} key={`md${newUUID()}`}/>
		);
	}

	// Bullet list //TODO ability to change bullet character and nested bullets
	match = line.match(/^\* (.*)/);
	if (match) {
		return (
			<ListItem key={`md${newUUID()}`} disablePadding sx={{}}>
				<ListItemButton sx={{height:"100%",padding:"0px"}}>
					<ListItemIcon sx={{minWidth:"20px",fontSize:"0.5rem"}}>
						<CircleIcon fontSize={"small"} sx={{minWidth:"20px",fontSize:"0.5rem"}}/>
					</ListItemIcon>
					<ListItemText><TypographyParagraph sx={{display:"block"}} key={`md${newUUID()}`}>{line.substring(1)}</TypographyParagraph></ListItemText>
				</ListItemButton>
			</ListItem>
		)
	}

	match = line.match(/^\!\[(.*?)\]\((.*?)\)/);
	if (match) {
		return(
			<img style={sx} key={`md${newUUID()}`} src={url.decode(match[2],true)}/>
		);
	}

	//TODO why hard coded 5px?
	sx={...sx,...{paddingRight: "5px"}};

	return(<TypographyParagraph sx={sx} key={`md${newUUID()}`}>{RecursiveFormatters(line)}</TypographyParagraph>);
}