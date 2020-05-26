/** @module locus/Locus */
import Queueable from "@nautoguide/ourthings/Queueable";
import AWS from 'aws-sdk';


/**
 * @classdesc
 *
 * Madeline core functions
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
		let location='SRID=4326;POINT(-0.743166424536075 51.3394703242612)';
		if(memory.myLocation&&memory.myLocation.value)
			location=memory.myLocation.value;
		this.queue.setMemory('myLocation', location, "Permanent");

		this.finished(pid, this.queue.DEFINE.FIN_OK);

	}

}


export default Locus;