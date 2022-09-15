import ArgsSerialize from "./argsSerialize";
import TypographyBold from "../components/widgets/typography/typographyBold";
import React from "react";
import TypographyItalics from "../components/widgets/typography/typographyItalics";
import TypographyLink from "../components/widgets/typography/typographyLink";

class MdSerialize {

	constructor() {
	}

	parseHTML(html) {
		const ARGS=new ArgsSerialize();
		let mdArray=[];

		for(let child in html.children) {
			switch(html.children[child].localName) {
				case 'h1':
				case 'h2':
				case 'h3':
				case 'h4':
					mdArray.push({
						"type":html.children[child].localName,
						"style":html.children[child].dataset.style,
						"children":[
							{ "text":html.children[child].innerText}
						]
					});
					break;
				case 'div':

					if(html.children[child].dataset.plugin) {
						let pluginArgs=ARGS.parse(html.children[child].dataset.params);
						mdArray.push({
							"type":"plugin",
							"plugin":html.children[child].dataset.plugin,
							"params":pluginArgs
						})
					} else {
						mdArray.push({
							"type": "p",
							"style": html.children[child].dataset.style,
							"children": this._parseHTMLChildren(html.children[child])
						});
					}
					break;
				case 'hr':
					mdArray.push({
						"type":"divider",
						"style":html.children[child].dataset.style,
					});
			}

		}
		return mdArray;
	}

	_convertNodeType(value) {
		switch(value) {
			case '#text': return "text";
			case 'B': return "bold";
			case 'I': return "italic";
			case 'BR': return "br";
			case 'A': return "link";
			default:
				debugger;
		}
	}

	_parseHTMLChildren(node) {
		let nodes=[];
		if(node.childNodes.length===0) {
			return [{ "text":node.innerText}]
		}
		for(let child=0;child<node.childNodes.length;child++) {
			nodes.push({"text":node.childNodes[child].nodeType===3? node.childNodes[child].textContent:node.childNodes[child].innerText,"type":this._convertNodeType(node.childNodes[child].nodeName)})
		}
		return nodes;
	}

	/**
	 * Take text and convert to object
	 * @param text
	 */
	parse(text) {

		const ARGS=new ArgsSerialize();
		let textArray=text.split("\n");
		let mdArray=[];

		for (let line in textArray) {

			// Clean any formatters
			textArray[line] = textArray[line].replace(/\r/, '');

			// extract any SX params first for the line  {"foo":"bar"}

			let sxMatch = textArray[line].match(/^\{(.*?)\}/);
			let sx = undefined;
			if (sxMatch !== null) {
				sx = JSON.parse(sxMatch[0]);
				textArray[line] = textArray[line].replace(sxMatch[0], '');
			}

			// Find any replace style tags  &STYLE&
			let style=undefined;
			let styleMatch = textArray[line].match(/^\&(.*?)\&/);
			if (styleMatch !== null) {
				style=styleMatch[1];
				textArray[line] = textArray[line].replace(styleMatch[0], '');
			}

			// Blank line

			if(textArray[line]==="") {
				mdArray.push(
					{
						type:"br"
					}
				)
				continue;
			}

			// Header

			let match = textArray[line].match(/^#+ /);
			if (match) {
				let headerType = match[0].length - 1;
				let cleanedMatch = textArray[line].replace(match[0], '');
				mdArray.push({
					"type":"h" + headerType,
					sx:sx,
					style:style,
					"children":[
						{ "text":cleanedMatch}
					]
				})
				continue;
			}

			// divider
			match = textArray[line].match(/^----------/);
			if (match) {
				mdArray.push({
					"type":"divider",
					sx:sx,
					style:style
				})
				continue;
			}

			// Plugins our format %%
			match = textArray[line].match(/^%(.*?)%/);
			if (match) {
				const pluginMatch = match[1].match(/^([a-zA-Z]*)\s{0,1}/);
				let pluginArgStr = match[1].replace(pluginMatch[0], '');

				let pluginArgs=ARGS.parse(pluginArgStr);

				mdArray.push({
					"type":"plugin",
					"plugin":pluginMatch[1],
					"params":pluginArgs
				})
				continue;
			}


			mdArray.push({
				"type":"p",
				sx:sx,
				style:style,
				"children":this._parseChildren(textArray[line])
			})
		}
		return mdArray;
	}

	_parseChildren(line) {
		let children=[];
		let matches;

		while(matches = line.match(/\*\*(.*?)\*\*/)) {
			children.push({"text":line.slice(0,line.indexOf(matches[0]))});
			line=line.slice(line.indexOf(matches[0]));
			line=line.replace(matches[0],'');
			children.push({"text":matches[1],"type":"bold"});
		}

		while(matches = line.match(/_(.*?)_/)) {
			children.push({"text":line.slice(0,line.indexOf(matches[0]))});
			line=line.slice(line.indexOf(matches[0]));
			line=line.replace(matches[0],'');
			children.push({"text":matches[1],"type":"italic"});
		}

		while(matches=line.match(/\[(.*?)\]\((.*?)\)/)) {
			children.push({"text":line.slice(0,line.indexOf(matches[0]))});
			line=line.slice(line.indexOf(matches[0]));
			line=line.replace(matches[0],'');
			children.push({"text":matches[1],"type":"link","ref":matches[2]});
		}

		if(line.length>0)
			children.push({"text":line});
		return children;
	}

	stringify(json,codes=false) {
		const ARGS=new ArgsSerialize();

		let string='';
		for(let i in json) {
			if(json[i].style!==undefined&&codes===false)
				string+=`&${json[i].style}&`;
			if(json[i].sx!==undefined&&codes===false)
				string+=`${JSON.stringify(json[i].sx)}`;
			switch(json[i].type) {
				case 'h1':
					string+=`# ${json[i].children[0].text}`;
					string+='\n';
					break;
				case 'h2':
					string+=`## ${json[i].children[0].text}`;
					string+='\n';
					break;
				case 'h3':
					string+=`### ${json[i].children[0].text}`;
					string+='\n';
					break;
				case 'h4':
					string+=`### ${json[i].children[0].text}`;
					string+='\n';
					break;
				case 'p':
					////// need multi kids
					string+=this._stringifyChildren(json[i].children);
					string+='\n';
					break;
				case 'divider':
					string+=`----------`;
					string+='\n';
					break;
				case 'plugin':
					string+=`%${json[i].plugin} ${ARGS.stringify(json[i].params)}%`;
					string+='\n';
					break;
				case 'br':
					string+='\n';
					break;
			}

		}
		return string;
	}

	_stringifyChildren(children) {
		let string='';
		for(let child in children) {
			string+=this._stringifyChild(children[child]);
		}
		return string;
	}

	_stringifyChild(child) {
		switch(child.type) {
			case 'italic':
				return `_${child.text}_`;
			case 'link':
				return `[${child.text}](${child.ref})`;
			case 'bold':
				return `**${child.text}**`;
			default:
				return child.text;
		}
	}

}

export default MdSerialize;