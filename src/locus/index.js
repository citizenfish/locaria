/*
 * Add ourthings react queue
 */
import {Queue} from '@nautoguide/ourthings-react';
import Websockets from '@nautoguide/ourthings-react/Queueable/Websockets';
import Internals from '@nautoguide/ourthings-react/Queueable/Internals';
import Openlayers from '@nautoguide/ourthings-react/Queueable/Openlayers';
import Locus from './locus';
import Define from '@nautoguide/ourthings-react/Define.js';
const DEFINE = new Define();
/*
 * Add react
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

/*
 * Start our queues
 */
window.queue = new Queue({
	"Websockets": Websockets,
	"Internals":Internals,
	"Openlayers":Openlayers,
	"Locus": Locus
});

/*
 * define all our queues
 */
window.queue.commandsQueue(
	[
		// Start the websocket
		{
			options: {
				queueRun: DEFINE.COMMAND_INSTANT
			},
			queueable: "Websockets",
			command: "websocketInit",
			json: {"url": window.config.ws},
			commands: [
				{
					queueable: "Websockets",
					command: "websocketSend",
					json: {"message":{"queue":"session","api":"session"}}
				}
			]
		},

		// We have a session
		{
			options: {
				queuePrepare: "session"
			},
			queueable: "Internals",
			command: "nop"
		}
	]
)


ReactDOM.render(<App/>, document.getElementById('root'));


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


