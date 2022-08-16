class ArgsSerialize {
	constructor() {
	}

	parse(text) {
		let matchArgs = text.match(/(?:[^\s"]+|"[^"]*")+/g);
		let argsObject = {};
		for (let a in matchArgs) {
			let cmdArray = matchArgs[a].split(/^([a-zA-Z0-9]+)(=)/);
			if(cmdArray[3]) {
				let evalCmd = cmdArray[3].replace(/\\"/, '"');
				try {
					argsObject[cmdArray[1]] = eval(JSON.parse(evalCmd));
				} catch (e) {
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
			string+=`${i}=${JSON.stringify(json[i])}`;
		}
		return string;
	}
}

export default ArgsSerialize;