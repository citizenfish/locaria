/** @module locus/Locus */
import Queueable from "@nautoguide/ourthings-react/Queueable";


/**
 * @classdesc
 *
 * Locus core functions
 *
 * @author Richard Reynolds richard@nautoguide.com
 *
 */
class Locus extends Queueable {
	defaultValues(pid,json) {
		// Postcode
		let postcode='GU15 3HD';
		if(memory.myPostcode&&memory.myPostcode.value)
			postcode=memory.myPostcode.value;
		this.queue.setMemory('myPostcode', postcode, "Permanent");

		let postcodeText='Surrey Heath Council Offices';
		if(memory.myPostcodeText&&memory.myPostcodeText.value)
			postcodeText=memory.myPostcodeText.value;
		this.queue.setMemory('myPostcodeText', postcodeText, "Permanent");

		let location='SRID=4326;POINT(-0.743166424536075 51.3394703242612)';
		if(memory.myLocation&&memory.myLocation.value)
			location=memory.myLocation.value;
		this.queue.setMemory('myLocation', location, "Permanent");

		let point=[-0.743166424536075,51.3394703242612];
		if(memory.myPoint&&memory.myPoint.value)
			point=memory.myPoint.value;
		this.queue.setMemory('myPoint', point, "Permanent");

		let unit='miles';
		if(memory.unit&&memory.unit.value)
			unit=memory.unit.value;
		this.queue.setMemory('unit', unit, "Permanent");

		this.finished(pid, this.queue.DEFINE.FIN_OK);

	}

	postcodeDisplay(pid,json) {
		let postcodeRegex=/([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/;
		console.log(json.text.match(postcodeRegex));

		if(json.text.match(postcodeRegex)) {
			queue.execute('hideLocationHint');
		} else {
			queue.execute('showLocationHint');
		}
		this.finished(pid, this.queue.DEFINE.FIN_OK);
	}

}


export default Locus;