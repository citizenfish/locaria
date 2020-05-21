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
	defaultPostcode(pid,json) {
		let postcode='GU15 3HD';
		if(memory.myPostcode&&memory.myPostcode.value)
			postcode=memory.myPostcode.value;
		this.queue.setMemory('myPostcode', postcode, "Permanent");
		this.finished(pid, this.queue.DEFINE.FIN_OK);

	}

}


export default Locus;