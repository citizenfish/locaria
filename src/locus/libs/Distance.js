/** @module Distance */

/**
 * @classdesc
 *
 * Distance conversions
 *
 * @author Richard Reynolds richard@nautoguide.com
 *
 * @example
 * //
 *
 */


const units= {
	"mile":1609,
	"km":1000
}
export default class Distance {


	/**
	 * Create a new websocket
	 *
	 * @param {number} pid - Process ID
	 * @param {object} json - queue arguments
	 * @param {string} json.url - URL to connect websocket too
	 * @param {string} json.action - What json param will contain the 'action' router
	 * @param {string} json.queues - Array of {action:"action", queue:"queue" }

	 */
	distanceActual(distance,unit) {
		return distance*units[unit];
	}

	distanceFormatNice(distance,unit,meterSwitch) {
		meterSwitch=meterSwitch||0;
		let niceDistance = parseFloat(distance / units[unit]).toFixed(1);
		if (niceDistance <= meterSwitch)
			return 0.1;
		return niceDistance;
	}


}