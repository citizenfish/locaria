import {exec} from "child_process";

const {Window, Renderer, Text, View,Button} = require("@nodegui/react-nodegui");
import React from "react";

const fs = require('fs')
const customFile = '../../locaria.json';

let configs = {};

let theme;


const styleSheet = `
  #rootView{
    height: '100%';
    background-color: blue;
  }
  #label {
    flex: 1;
    color: white;
    background-color: green;
  }
  #view {
    flex: 3;
    background-color: white;
  }
`;

const selectClusterHandler = (selectTheme) => {
	theme=selectTheme;
	console.log(theme);
}

const ShowClusterButtons =() => {
	let buttons=[];
	for (let i in configs.custom) {
		buttons.push(<Button text={i} onClick={()=>selectClusterHandler(i)} />);
		console.log(`[${i}]`);
	}
	return buttons;
}


const App = () => {
	return (
		<Window styleSheet={styleSheet}>
			<View id="rootView">
				<Text id="label">Select Cluster</Text>
				<ShowClusterButtons></ShowClusterButtons>
				<ShowThemeButtons></ShowThemeButtons>
			</View>
		</Window>
	);
};

const ShowThemeButtons =() => {
	let buttons=[];
	if(theme) {
		for (let i in configs.custom) {
			buttons.push(<Button text={i} onClick={selectClusterHandler}/>)
			console.log(`[${i}]`);
		}
		return buttons;
	} else {
		return (
			<Text id="label">No theme selected</Text>
		)
	}
}



// Load all our config

function checkEnvironment() {

	exec('aws configure list', (err, stdout, stderr) => {
		if (err) {
			//some err occurred
			console.log('AWS CLI is not found please install https://docs.aws.amazon.com/cli/latest/userguide/install-windows.html');
			process.exit();
		} else {
			console.log(`AWS CLI available`);
			if (fs.existsSync(customFile)) {
				console.log('Existing config found');
				configs.custom = JSON.parse(fs.readFileSync(customFile, 'utf8'));
			} else {
				configs.custom = {};
				console.log('No existing config found');
			}
			Renderer.render(<App/>);
		}
	});
}

checkEnvironment();


