export default class Channels {

	constructor() {
		this.channels={};
	}

	listChannels() {
		return Object.keys(this.channels);
	}

	addChannel(channel,config) {
		this.channels[channel]=config;
	}

	displayChannel(channel) {
		let display=this.channels[channel]['display'];
		if(display===undefined)
			display=true;
		return display;
	}

	getChannelProperty(channel,property) {
		return this.channels[channel][property];

	}

	getChannelProperties(channel) {
		if(this.channels[channel]) {
			return this.channels[channel];
		} else {
			console.log(`Request for [${channel}] that doesn't exits`);
			return undefined;
		}
	}

	getChannelMapIcon(channel,tags) {
		let chan=this.getChannelProperties(channel);
		if(chan===undefined)
			return undefined;
		let icon=chan.mapIcon;
		if(tags[0]!==undefined) {
			for(let tag in chan.tags) {
				if(tag===tags[0]) {
					icon=chan.tags[tag].mapIcon;
				}
			}
		}
		return icon;
	}

	getChannelColor(channel,tag) {
		let chan=this.getChannelProperties(channel);
		let color=chan.color;
		if(tag!==undefined) {
			for(let t in chan.tags) {
				if(t===tag) {
					color=chan.tags[t].color;
				}
			}
		}
		return color;
	}

	getChannelSearchItem(channel,search) {
		let chan=this.getChannelProperties(channel);
		for(let s in chan.search) {
			if(chan.search[s].component===search)
				return chan.search[s];
		}
		return false;
	}

	mergeDataWithForm(channel,data) {

		let sections=["title","main","extra"]
		let chan=this.getChannelProperties(channel);
		const fields=chan.fields;
		for(let s in sections) {
			if(fields[sections[s]]) {
				if(Array.isArray(fields[sections[s]]))
					this._mergeDataWithFormSection(fields[sections[s]],data);
				else
					this._mergeDataWithFormSection([fields[sections[s]]],data);
			}
		}
	}

	_mergeDataWithFormSection(fields,data) {
		for(let f in fields) {
			let newValue=document.getElementById(`${fields[f].key}-id`).value;
			eval(`data.${fields[f].key} = newValue`);
		}
	}


}