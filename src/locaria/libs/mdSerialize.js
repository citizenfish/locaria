import ArgsSerialize from "./argsSerialize";

class MdSerialize {

	constructor() {
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
				"children":[
					{ "text":textArray[line]}
				]
			})
		}
		return mdArray;
	}

	stringify(json) {
		const ARGS=new ArgsSerialize();

		let string='';
		for(let i in json) {
			if(json[i].style!==undefined)
				string+=`&${json[i].style}&`;
			if(json[i].sx!==undefined)
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
					string+=`${json[i].children[0].text}`;
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

}

export default MdSerialize;