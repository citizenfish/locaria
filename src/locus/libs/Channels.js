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
		return this.channels[channel];
	}

	getChannelMapIcon(channel,tags) {
		let chan=this.getChannelProperties(channel);
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


}