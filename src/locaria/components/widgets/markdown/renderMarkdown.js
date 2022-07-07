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

const url = new UrlCoder();

export default function RenderMarkdown({markdown}) {

	let splitMarkdown = markdown.split('\n');
	let renderedMarkdown = [];

	for (let line in splitMarkdown) {
		renderedMarkdown.push(ProcessLine(splitMarkdown[line]));
	}

	return (
		<>
			{renderedMarkdown}
		</>
	)
}

function RecursiveFormatters(line) {
	let returns=[];
	let matches;

	// Bold **Foo**
	while(matches = line.match(/\*\*(.*?)\*\*/)) {
		returns.push(<span>{line.slice(0,line.indexOf(matches[0]))}</span>);
		line=line.slice(line.indexOf(matches[0]));
		line=line.replace(matches[0],'');
		returns.push(<TypographyBold sx={{display: "inline-block", }}
									 key={`md${newUUID()}`}>{matches[1]}</TypographyBold>);
	}

	//Italics _Foo_
	while(matches = line.match(/_(.*?)_/)) {
		returns.push(<span>{line.slice(0,line.indexOf(matches[0]))}</span>);
		line=line.slice(line.indexOf(matches[0]));
		line=line.replace(matches[0],'');
		returns.push(<TypographyItalics sx={{display: "inline-block", }}
									 key={`md${newUUID()}`}>{matches[1]}</TypographyItalics>);
	}

	while(matches=line.match(/\[(.*?)\]\((.*?)\)/)) {
		returns.push(<span>{line.slice(0,line.indexOf(matches[0]))}</span>);
		line=line.slice(line.indexOf(matches[0]));
		line=line.replace(matches[0],'');
		returns.push(
			<TypographyLink sx={{display: "inline-block"}} link={matches[2]}>{matches[1]}</TypographyLink>
		);
	}


	if(line.length>0)
		returns.push(<span>{line}</span>);

	return returns;
}

function newUUID() {
	return uuidv4();

}

function ProcessLine(line) {

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

		return(
			<TypographyHeader sx={sx} element={"h" + headerType}
							  key={`md${newUUID()}`}>{cleanedMatch}</TypographyHeader>
		);
	}

	// Plugins our format %%
	match = line.match(/^%(.*?)%/);
	if (match) {
		return(
			<RenderPlugin key={`plugin${match[1]}`} plugin={match[1]}></RenderPlugin>
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
			<TypographyParagraph sx={{display:"block"}} key={`md${newUUID()}`}>&#8226; {line.substring(1)}</TypographyParagraph>
		);
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