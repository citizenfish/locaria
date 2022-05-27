import {v4 as uuidv4} from 'uuid';
import {Base64} from 'js-base64';

const magic = {
	MAX_BYTES:50000
}

/**
 * @classdesc
 *
 * AWS wsp client
 *
 * @author Richard Reynolds richard@nautoguide.com
 *
 * @example
 * let queue = new wspClient();
 */
class wspClient {


	constructor() {
	}

	onOpen() {
		console.log('Open');
	}

	onClose(event) {
		console.log(event);
	}

	onMessage(message) {
		console.log(message);
	}

	onError(event) {
		console.log(event);
	}

	open(config) {
		let self=this;

		let options = Object.assign({
			"url": "ws://localhost",
		}, config);

		self.frames = {};
		self.socket = new WebSocket(options.url);
		self.socket.onopen = function (event) {
			self.onOpen();
		};
		self.socket.onmessage = function (event) {
			let jsonData = JSON.parse(event.data);

			/*
			 * Is this part of a multi packet?
			 *
			 * For AWS websockets size is limited so we split packets down into frames IE:
			 *
			 * { frame: 1, totalFrames: 10, data: "BASE64" }
			 *
			 * This decodes those frames, you will need to implement the split in your AWS websocket code
			 */
			if (jsonData['frame'] !== undefined) {
				//console.log(`${jsonData['uuid']} - ${jsonData['frame']} of ${jsonData['totalFrames']}`);
				if (self.frames[jsonData['uuid']] === undefined) {
					self.frames[jsonData['uuid']] = {"total": 0, data: new Array(parseInt(jsonData['totalFrames']))};
				}
				if (!self.frames[jsonData['uuid']].data[parseInt(jsonData['frame']) - 1]) {
					self.frames[jsonData['uuid']].data[parseInt(jsonData['frame']) - 1] = Base64.decode(jsonData['data']);
					self.frames[jsonData['uuid']].total++;
				} else {
					console.log(`Duplicate network packet!!! ${jsonData['uuid']} - ${jsonData['frame']}`);
				}
				if (self.frames[jsonData['uuid']].total === jsonData['totalFrames']) {
					const realJsonData = JSON.parse(self.frames[jsonData['uuid']].data.join(''));
					self.frames[jsonData['uuid']] = null;
					delete self.frames[jsonData['uuid']];
					jsonData = realJsonData;
					deployEvent();
				} else if (self.frames[jsonData['uuid']].total > jsonData['totalFrames']) {
					console.log('WARNING NETWORK CRAZY');
				}


			} else {
				/*
				 * Is this a super large packet using S3?
				 */
				if (jsonData['s3']) {
					fetch(jsonData['s3'], {})
						.then(function (response) {
							if (!response.ok) {
								self.onError(response);
							}
							return response;
						})
						.then(function (response) {
							return response.blob();
						})
						.then(function (response) {
							const reader = new FileReader();
							reader.addEventListener('loadend', () => {
								jsonData = JSON.parse(reader.result);
								deployEvent();
							});
							reader.readAsText(response);


						})
						.catch(function (error) {
							self.onError(error);
						});
				} else {
					deployEvent();
				}
			}


			function deployEvent() {
				//console.log(jsonData);
				decompress();
				//console.log(jsonData);
				self.onMessage(jsonData);
			}

			function decompress() {


				if(jsonData.packet.options&&jsonData.packet.options.compress) {
					//console.log('Compressed Packet');
					for(let f in jsonData.packet.geojson.features) {
						let uncompressedProperties={};
						recurseProperties(jsonData,jsonData.packet.geojson.features[f].properties,uncompressedProperties);
						jsonData.packet.geojson.features[f].properties=uncompressedProperties;
					}
				}


			}

			function recurseProperties(payload,ptr,savePtr) {
				for(let p in ptr) {
					if(typeof ptr[p] === 'object' && !Array.isArray(ptr[p]) && ptr[p] !== null) {
						savePtr[payload.packet.options.compress.properties[p]]={};
						recurseProperties(payload,ptr[p],savePtr[payload.packet.options.compress.properties[p]]);
					} else {
						savePtr[payload.packet.options.compress.properties[p]] = ptr[p];
					}

				}

			}

		};

		self.socket.onclose = function (event) {
			self.onClose(event);
		};

		self.socket.onerror = function (event) {
			self.onError(event);
		};

	}

	close(pid,json) {
		let self=this;
		self.frames = {};
		self.socket.close();
		return true;
	}

	send(json) {
		let self = this;
		self.currentPacket = 0;
		self.totalPackets = 0;
		self.packetArray = [];
		self.uuid = uuidv4();
		const payload = JSON.stringify(json);
		if (payload.length > magic.MAX_BYTES) {
			self.totalPackets = Math.ceil(payload.length / magic.MAX_BYTES);
			for (let i = 0; i < self.totalPackets; i++) {
				let loc = i * magic.MAX_BYTES;
				let sub = payload.slice(loc, magic.MAX_BYTES + loc);
				self.packetArray.push(sub);
			}
			self._websocketSendPacket();
		} else {
			try {
				self.socket.send(payload);
			} catch (event) {
				self.onError(event);
			}
		}
	}

	_websocketSendPacket() {
		let self = this;
		/*
		 * more work?
		 */
		if (self.currentPacket < self.totalPackets) {
			let packet = Base64.encode(self.packetArray.shift());
			self.currentPacket++;

			try {
				self.socket.send(JSON.stringify({
					"frame": self.currentPacket,
					"totalFrames": self.totalPackets,
					"uuid": self.uuid,
					"data": packet
				}));
			} catch (event) {
				self.onError(event);
			}
			setTimeout(function () {
				self._websocketSendPacket();
			}, 200);
		}
	}
}


export default wspClient;