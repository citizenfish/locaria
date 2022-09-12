class ArgsSerialize {
	constructor() {
	}

	parse(text) {
		//debugger;
		//text=text.replace(/&quot;/g, '"');
		let matchArgs = text.match(/(?:[^\s"]+|"[^"]*")+/g);
		let argsObject = {};
		for (let a in matchArgs) {
			let cmdArray = matchArgs[a].split(/^([a-zA-Z0-9]+)(=)/);
			if(cmdArray[3]) {
				let evalCmd = cmdArray[3].replace(/\\"/, '"');
				try {
					argsObject[cmdArray[1]] = eval(JSON.parse(evalCmd));
				} catch (e) {
					//console.log(evalCmd);

					argsObject[cmdArray[1]] = eval(evalCmd);

				}
			} else {
				argsObject[cmdArray[1]]={};
			}
		}

		return argsObject;
	}

	stringify(json) {
		let string='';
		for(let i in json) {
			string+=`${i}=${JSON.stringify(json[i])} `;
		}
		string=string.replace(/\s$/,'');
		return string;
	}

	escapeStringArgs(str) {
		str=str.replace(/"/g, "\"");
		return str;
	}
}

export default ArgsSerialize;