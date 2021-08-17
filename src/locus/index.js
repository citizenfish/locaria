
import Websockets from "./libs/Websockets";
/*
 * Add react
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import cssOL from './components/css/ol.css';

window.websocket=new Websockets();

window.websocket.init({"url": window.config.ws},connected,closed,errored);


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



/*
 * HELPERS
 */

/*

 TODO: Move to a class
const metersPerMile=1609;
const metersPerKm=1000;
const meterSwitch=0;

window.distanceActual= function(distance) {
	if(memory.unit.value==='miles') {
		return distance * metersPerMile;
	} else {
		return distance *metersPerKm;
	}
}

window.distanceFormatNumber = function(distance) {
	if(memory.unit.value==='miles') {

		let miles = parseFloat(distance / metersPerMile).toFixed(1);
		if (miles <= meterSwitch) {
			return 0.1;
			//return parseInt(distance*1.094);
		}
		return miles;
	} else {
		let kms = parseFloat(distance / metersPerKm).toFixed(1);
		if (kms <= meterSwitch) {
			return 0.1;
			//return parseInt(distance);
		}
		return kms;
	}
}

window.distanceFormat = function (distance) {
	if(memory.unit.value==='miles') {
		let miles = parseFloat(distance / metersPerMile).toFixed(1);
		if (miles <= meterSwitch) {
			return 'less';
		}
		return 'more';
	} else {
		let kms = parseFloat(distance / metersPerKm).toFixed(1);
		if (kms <= meterSwitch) {
			return 'less';
		}
		return 'more';
	}
}
*/


