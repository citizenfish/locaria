
import Websockets from "./libs/Websockets";
/*
 * Add react
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { configs } from "themeLocus";

import cssOL from './components/css/ol.css';

document.title=configs.siteTitle;
window.websocket=new Websockets();

window.websocket.init({"url": configs.websocket},connected,closed,errored);


function connected() {
	ReactDOM.render(<App/>, document.getElementById('root'));

}

function closed(event) {
	console.log(`websock closed: ${event}`);
	window.websocket.connect();
}

function errored(event) {
	console.log(`websock errored: ${event}`);

}



