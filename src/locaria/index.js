import Websockets from "./libs/Websockets";
/*
 * Add react
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {configs, resources} from "themeLocus";

import cssOL from './components/css/ol.css';

let tries = 0;

document.title = configs.siteTitle;
window.websocket = new Websockets();

window.websocket.init({"url": resources.websocket}, connected, closed, errored);


function connected() {

	ReactDOM.render(<App/>, document.getElementById('root'));
}

function closed(event) {
	console.log(`websock closed: ${event}`);
	if (tries <= 3)
		window.websocket.connect();
}

function errored(event) {
	tries++;
	console.log(`websock errored: ${event}`);
	if (tries > 2) {
		ReactDOM.render(<App/>, document.getElementById('root'));
	}
}



