import React from 'react';
import TypographyHeader from "../typography/typographyHeader";
import TypographyParagraph from "../typography/typographyParagraph";
import RenderPlugin from "./renderPlugin";
import Divider from "@mui/material/Divider";
import UrlCoder from "../../../libs/urlCoder";
import { v4 as uuidv4 } from 'uuid';
import TypographyLink from "../typography/typographyLink";

const url = new UrlCoder();

export default function RenderMarkdown({markdown}) {

	const mdid=uuidv4();
	let splitMarkdown = markdown.split('\n');
	let renderedMarkdown = [];
	let lineId = 0;
	for (let line in splitMarkdown) {
		lineId++;
		// Clean any formatters

		splitMarkdown[line] = splitMarkdown[line].replace(/\r/, '');

		// extract any SX params first for the line

		let sxMatch = splitMarkdown[line].match(/^\{(.*?)\}/);
		let sx = {};
		if (sxMatch !== null) {
			sx = JSON.parse(sxMatch[0]);
			splitMarkdown[line] = splitMarkdown[line].replace(sxMatch[0], '');
		}

		// let match the normal MD


		if (splitMarkdown[line] === "") {
			renderedMarkdown.push(
/*
				<p style={{}} key={`md${mdid}${lineId}`}></p>
*/
				<TypographyParagraph sx={{display:"block"}} key={`md${mdid}${lineId}`}></TypographyParagraph>
		);
			continue;
		}
		// Headers IE H1 H2 etc
		let match = splitMarkdown[line].match(/^#+ /);
		if (match) {
			let headerType = match[0].length - 1;
			let cleanedMatch = splitMarkdown[line].replace(match[0], '');

			renderedMarkdown.push(
				<TypographyHeader sx={sx} element={"h" + headerType}
								  key={`md${mdid}${lineId}`}>{cleanedMatch}</TypographyHeader>
			);
			continue;
		}

		// Plugins our format %%
		match = splitMarkdown[line].match(/^%(.*?)%/);
		if (match) {
			renderedMarkdown.push(
				<RenderPlugin key={`plugin${match[1]}`} plugin={match[1]}></RenderPlugin>
			);
			continue;
		}

		// HR to <Dividor>
		match = splitMarkdown[line].match(/^----------/);
		if (match) {
			renderedMarkdown.push(
				<Divider sx={{marginTop:"10px",marginBottom:"10px"}} key={`md${mdid}${lineId}`}/>
			);
			continue;
		}

		// Bold
		match = splitMarkdown[line].match(/^\*\*(.*?)\*\*/);
		if (match) {
			renderedMarkdown.push(<TypographyParagraph sx={{display:"block",fontWeight:"bold"}} key={`md${mdid}${lineId}`}>{match[1]}</TypographyParagraph>);
			continue;
		}

		match = splitMarkdown[line].match(/^\[(.*?)\]\((.*?)\)/);
		if (match) {
			renderedMarkdown.push(
				<TypographyLink sx={{display: "inline-block",paddingRight: "5px"}} link={match[2]}>{match[1]}</TypographyLink>
			);
			continue;
		}


		match = splitMarkdown[line].match(/^\!\[(.*?)\]\((.*?)\)/);
		if (match) {
			renderedMarkdown.push(
				<img style={sx} key={`md${mdid}${lineId}`} src={url.decode(match[2],true)}/>
			);
			continue;
		}

		sx={...sx,...{display:"inline-block",  paddingRight: "5px"}};

		renderedMarkdown.push(<TypographyParagraph sx={sx} key={`md${mdid}${lineId}`}>{splitMarkdown[line]}</TypographyParagraph>);
	}

	return (
		<>
			{renderedMarkdown}
		</>
	)
}