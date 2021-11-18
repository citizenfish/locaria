/** @module Websockets */
import wspClient from '@nautoguide/aws-wsp/wsp-client';

/**
 * @classdesc
 *
 * Websockets connection methods
 *
 * @author Richard Reynolds richard@nautoguide.com
 *
 * @example
 * //
 *
 */


export default class Websockets {


	/**
	 * Create a new websocket
	 *
	 * @param {number} pid - Process ID
	 * @param {object} json - queue arguments
	 * @param {string} json.url - URL to connect websocket too
	 * @param {string} json.action - What json param will contain the 'action' router
	 * @param {string} json.queues - Array of {action:"action", queue:"queue" }

	 */
	init(options, connected, closed, error) {
		let self = this;

		self.connected = false;
		self.queues = {};
		self.options = options;


		self.ws = new wspClient();

		self.ws.onOpen = function () {
			self.connected = true;
			connected();

		}

		self.ws.onMessage = function (jsonData) {

			if (self.queues[jsonData["queue"]] !== undefined) {
				self.queues[jsonData["queue"]](jsonData)
			} else {
				console.log(`No queue registered for ${jsonData["queue"]}`)
			}


		}

		self.ws.onClose = function (event) {
			closed(event);
		}


		self.ws.onError = function (event) {
			error(event);
		}

		//self.ws.open({url:options.url});
		self.connect();

	}

	connect() {
		let self = this;
		self.ws.open({url: self.options.url});
	}

	registerQueue(queue, hook) {
		this.queues[queue] = hook;
	}

	clearQueues() {
		this.queues = [];
	}

	close(pid, json) {
		this.ws.close();
	}


	/**
	 * Send a json message down the websocket
	 *
	 * @param {number} pid - Process ID
	 * @param {object} json - queue arguments
	 * @param {string} json.message - JSON message to send
	 * @param {string} json.bulk - Bulk messages
	 * @param {string} json.bulk - Bulk bulkQueue
	 * @param {string} json.debug - Debug to console
	 * @param {string} json.sendQueue - Queue to always call on send
	 *
	 */
	send(message) {
		let self = this;
		self.ws.send(message);
	}


}
