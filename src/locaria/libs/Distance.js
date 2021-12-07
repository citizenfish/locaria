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
	"mile":{"lang":"Miles",value:1609},
	"km":{"lang":"KM",value:1000}
}



export default class Distance {

	distanceLang(unit) {
		return units[unit].lang;
	}
	distanceActual(distance,unit) {
		distance=parseFloat(distance);
		return distance*units[unit].value;
	}

	distanceFormatNice(distance,unit,meterSwitch) {
		meterSwitch=meterSwitch||0;
		let niceDistance = parseFloat(distance / units[unit].value).toFixed(1);
		if (niceDistance <= meterSwitch)
			return `< 0.1 ${units[unit].lang}`;
		return `${niceDistance} ${units[unit].lang}`;
	}


}