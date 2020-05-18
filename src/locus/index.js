import { Queue } from '@nautoguide/ourthings';
import Templates from '@nautoguide/ourthings/Queueable/Templates';
import Elements from '@nautoguide/ourthings/Queueable/Elements';
import Internals from '@nautoguide/ourthings/Queueable/Internals';
import Mapbox from '@nautoguide/ourthings/Queueable/Mapbox';
import Browser from '@nautoguide/ourthings/Queueable/Browser';
import Api from '@nautoguide/ourthings/Queueable/Api';
import W3Menu from '@nautoguide/ourthings/Queueable/W3Menu';

import Locus from './locus';


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
		"mapbox": Mapbox,
		"browser": Browser,
		"w3menu":W3Menu

	});
	window.queue=queue;
});
