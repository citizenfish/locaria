import { Queue } from '@nautoguide/ourthings';
import Templates from '@nautoguide/ourthings/Queueable/Templates';
import Elements from '@nautoguide/ourthings/Queueable/Elements';
import Internals from '@nautoguide/ourthings/Queueable/Internals';
import Openlayers from '@nautoguide/ourthings/Queueable/Openlayers';
import Browser from '@nautoguide/ourthings/Queueable/Browser';
import Api from '@nautoguide/ourthings/Queueable/Api';
import Menu from '@nautoguide/ourthings/Queueable/Menu';

import Locus from './locus';

import {mainMapStyle,locationStyle} from '../../site/map-styles/main';
window.styles={};
window.styles.mainMapStyle=mainMapStyle;
window.styles.locationStyle=locationStyle;


/*
 * Startup
 */
let queue;
document.addEventListener("DOMContentLoaded", function(event) {
	queue = new Queue({
		"templates": Templates,
		"elements": Elements,
		"api": Api,
		"locus": Locus,
		"internals": Internals,
		"openlayers": Openlayers,
		"browser": Browser,
		"menu":Menu

	});
	window.queue=queue;
});

/*
 * HELPERS
 */

const metersPerMile=1609;
const metersPerKm=1000;
const meterSwitch=0;

window.distanceFormatNumber = function(distance) {
	if(memory.unit.value==='miles') {

		let miles = parseFloat(distance / metersPerMile).toFixed(1);
		if (miles <= meterSwitch) {
			return parseInt(distance*1.094);
		}
		return miles;
	} else {
		let kms = parseFloat(distance / metersPerKm).toFixed(1);
		if (kms <= meterSwitch) {
			return parseInt(distance);
		}
		return kms;
	}
}

window.distanceFormat = function (distance) {
	if(memory.unit.value==='miles') {
		let miles = parseFloat(distance / metersPerMile).toFixed(1);
		if (miles <= meterSwitch) {
			return 'yards';
		}
		return 'miles';
	} else {
		let kms = parseFloat(distance / metersPerKm).toFixed(1);
		if (kms <= meterSwitch) {
			return 'meters';
		}
		return 'kms';
	}
}
