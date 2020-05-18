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
	/**
	 * Get the current sub domain we are operating on and set memory 'sub'
	 * @param pid
	 * @param json
	 * @example
	 * digital.subDomain();
	 */
	lexInit(pid, json) {
		let options = Object.assign({
			"region": "eu-west-1",
			"IdentityPoolId": "",
			"botName": "myBot"
		}, json);
		AWS.config.region = options.region; // Region
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: options.IdentityPoolId,
		});
		this.chatId = 0;
		this.lexruntime = new AWS.LexRuntime();
		this.params = {
			botAlias: '$LATEST',
			botName: options.botName,
			inputText: 'Last message',
			userId: `${options.botName}-${Date.now()}`
		};
		this.paramsVoice = {
			botAlias: '$LATEST',
			botName: options.botName,
			contentType: 'audio/x-l16; sample-rate=16000',
			userId: `${options.botName}-${Date.now()}`,
			accept: 'audio/mpeg'
		};
		this.finished(pid, this.queue.DEFINE.FIN_OK);
	}

	lexPush(pid, json) {
		let self = this;

		const localCommands=[
			{"command":"debug","event":"debug"},
			{"command":"clear","event":"clear"}
		];

		for(let i in localCommands) {
			if(json.message===localCommands[i].command) {
				self.queue.execute(localCommands[i].event);
				self.finished(pid, self.queue.DEFINE.FIN_OK);
				return;
			}
		}

		this.params.inputText = json.message;
		this.params.sessionAttributes = {
			"ourMessageId": "CB_" + this.chatId,
			"map_centre": `${memory.mapDetails.value.center.lng},${memory.mapDetails.value.center.lat}`,
			"map_zoom_level": `${memory.mapDetails.value.zoom}`,
			"sessionId": memory.sessionId.value
		};
		if(memory.location&&memory.location.value) {
			this.params.sessionAttributes.location=JSON.stringify(memory.location.value);
		}
		this.chatId++;
		this.lexruntime.postText(this.params, function (err, data) {
			if (err) {
				console.log(err, err.stack);
				self.queue.execute('lexError');
			} else {
				if (data.messageFormat !== 'PlainText')
					data.message = JSON.parse(data.message);
				self.queue.setMemory('lexMessage', data, "Session");
				self.queue.execute('lexReceive');
			}
			self.finished(pid, self.queue.DEFINE.FIN_OK);
		});
	}

	lexChat(pid, json) {
		let self = this;
		const splitChar = ' ';
		console.log(json);
		let domId = self.queue.getElement('#' + json.id);
		let splitText = json.message.split(splitChar);

		for (let i in splitText) {
			setTimeout(function () {
				addText(splitText[i] + splitChar);
			}, 50 * i);
		}

		function addText(text) {
			domId.insertAdjacentHTML('beforeend', text);
		}

		self.finished(pid, self.queue.DEFINE.FIN_OK);
	}

	pollyTalk(pid, json) {
		let self = this;
		let speechParams = {
			OutputFormat: "mp3",
			SampleRate: "16000",
			Text: json.message,
			TextType: "text",
			VoiceId: "Joanna"
		};
		if(memory.voiceMode.value!==true) {
			self.finished(pid, self.queue.DEFINE.FIN_OK);
			return;
		}
		let polly = new AWS.Polly({apiVersion: '2016-06-10'});
		let signer = new AWS.Polly.Presigner(speechParams, polly);

		// Create presigned URL of synthesized speech file
		signer.getSynthesizeSpeechUrl(speechParams, function (error, url) {
			if (error) {
				console.log(error);
			} else {
				let audio = new Audio(url);
				audio.play();
			}
			self.finished(pid, self.queue.DEFINE.FIN_OK);

		});
	}

	initVoice(pid, json) {
		let self = this;
		self.voiceMode=false;
		navigator.mediaDevices.getUserMedia({ audio: true })
			.then(stream => {
				this.mediaRecorder = new MediaRecorder(stream);
				self.finished(pid, self.queue.DEFINE.FIN_OK);
			});
	}

	manageLocation(pid, json) {
		let self=this;
		if(memory.lexMessage.value.sessionAttributes.location) {
			console.log('Location');
			let newLocation=JSON.parse(memory.lexMessage.value.sessionAttributes.location);
			if(memory.location===undefined||memory.location.value.properties.uprn!==newLocation.properties.uprn)
				self.queue.execute('newLocation');
			self.queue.setMemory('location', newLocation, "Permanent");
		}
		self.finished(pid, self.queue.DEFINE.FIN_OK);
	}

	terminal(pid,json) {
		let text=this.queue.getElement('.console').innerText;
		console.log(text);
		text=text.split('\n');
		text=text.filter(function (txt) {
			if(txt.length!==0)
				return txt;
		});
		console.log(text);
		this.queue.getElement('#message').value=text[text.length-1].replace(/\&gt\;/,'');
		this.queue.execute('lexSend');
		this.finished(pid, this.queue.DEFINE.FIN_OK);
	}

	sortFind(pid,json) {
		let sorted={};
		for(let i in memory.findGeojson.value.features) {
			let category=memory.findGeojson.value.features[i].properties.category;
			if(sorted[category]===undefined) {
				sorted[category]=[];
			}
			let tags="";
			let queries=this.queue.getElement('#search-query').value.split(' ');
			let startSlice=0;

			function processJson(ptr) {
				for(let p in ptr) {
					if (typeof ptr[p] === "string") {
						let property=ptr[p];
						let addProperty=false;
						for (let q in queries) {
							let txtRegex = new RegExp(queries[q], "gi");
							let match=property.match(txtRegex);
							if (match) {
								addProperty=true;
								//property=property.replace(txtRegex,'<b>'+match[0]+'</b>');

							}
						}
						if(addProperty) {
							//tags += '<i>' + p + '</i>' + ' - ' + property + ' ';
							tags += `${p}, ${property} `;
							for (let q in queries) {
								let txtRegex = new RegExp(queries[q], "gi");
								let match=tags.match(txtRegex);
								let startsAt=tags.indexOf(match[0]);
								if(startsAt>100&&(startSlice===0||startsAt<startSlice)) {
									let alpha = /^[a-zA-Z]+$/;
									for(let r=0; r<(150-(match[0].length+10));r++) {
										if(tags[startsAt].match(alpha)&&tags[startsAt]===tags[startsAt].toUpperCase())
											break;
										startsAt--;
									}
									startSlice = startsAt;
								}

							}
						}
					} else {
						processJson(ptr[p]);
					}
				}
			}

			processJson(memory.findGeojson.value.features[i].properties);
			let endSlice=startSlice+150;
			let len=tags.length;
			tags=tags.slice(startSlice,endSlice);
			if(len>150)
				tags+='...';
			for (let q in queries) {
				let txtRegex = new RegExp(queries[q], "gi");
				tags = tags.replace(txtRegex,`<b>${queries[q]}</b>`);

			}
			memory.findGeojson.value.features[i].properties.tags=tags
			sorted[category].push(memory.findGeojson.value.features[i].properties);
		}


		self.queue.setMemory('sortedFeatures', sorted, "Session");
		this.finished(pid, this.queue.DEFINE.FIN_OK);

	}

	toggleMode(pid,json) {
		let value=this.queue.getElement(json.id).getAttribute("data-mode");
		self.queue.setMemory('addMode', value, "Session");
		if(value==='append')
			value='delete';
		else
			value='append';
		this.queue.getElement(json.id).setAttribute("data-mode",value);


		this.finished(pid, this.queue.DEFINE.FIN_OK);
	}

	toggleRecord(pid,json) {
		let self=this;
		self.voiceMode=self.voiceMode||false;
		if(this.voiceMode===false) {
			self.voiceData = [];
			if(this.mediaRecorder===undefined) {
				navigator.mediaDevices.getUserMedia({audio: true})
					.then(stream => {
						self.mediaRecorder = new MediaRecorder(stream);
						self.mediaRecorder.addEventListener("dataavailable", event => {
							console.log(event);
							self.voiceData.push(event.data);
						});

						self.mediaRecorder.addEventListener("onstart", event => {
							console.log('onstart');
							self.voiceData = [];
						});

						self.mediaRecorder.addEventListener("stop", () => {
							const audioBlob = new Blob(self.voiceData);
							const audioUrl = URL.createObjectURL(audioBlob);
							const audio = new Audio(audioUrl);
							audio.play();
							self.paramsVoice.inputStream=audioUrl;
							self.paramsVoice.sessionAttributes = {
								"ourMessageId": "CB_" + this.chatId
							};
							self.chatId++;
							self.lexruntime.postContent(self.paramsVoice, function (err, data) {
								if (err) {
									console.log(err, err.stack);
									self.queue.execute('lexError');
								} else {
									if (data.messageFormat === 'CustomPayload')
										data.message = JSON.parse(data.message);
									self.queue.setMemory('lexMessage', data, "Session");
									self.queue.execute('lexReceive');
								}
								self.finished(pid, self.queue.DEFINE.FIN_OK);
							});
						});
						console.log('init voice');
						self.finished(pid, self.queue.DEFINE.FIN_OK);

					});
			} else {
				console.log('start');
				self.mediaRecorder.start();

				self.voiceMode = true;
				self.finished(pid, self.queue.DEFINE.FIN_OK);
			}

		} else {
			console.log('stop');
			this.mediaRecorder.stop();
			this.voiceMode=false;
			this.finished(pid, this.queue.DEFINE.FIN_OK);
		}

	}

}

function mergeBuffers(bufferArray) {
	let totalsize=0;
	for(i in bufferArray) {
		totalsize+=(bufferArray[i].length);
	}
	console.log(totalsize);
	var result = new Float32Array(totalsize);
	var offset = 0;
	for (var i = 0; i < bufferArray.length; i++) {
		result.set(bufferArray[i], offset);
		offset += bufferArray[i].length;
	}
	return result;
}


export default Locus;