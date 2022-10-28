import {findArrayObject} from "./arrayTools";

export default class Channels {

	constructor(channels) {
		this.channels=channels;
	}

	listChannels() {
		let channelList=[];
		for(let c in this.channels)
			channelList.push(this.channels[c].key);
		return channelList.sort();
	}

	addChannel(channel,config) {
		this.channels[channel]=config;
	}

	displayChannel(channel) {
		let display=this._findChannel(channel)['display'];
		if(display===undefined)
			display=true;
		return display;
	}


	getChannelProperty(channel,property) {
		return this.channels[channel][property];

	}

	_findChannel(channel) {
		for(let c in this.channels) {
			if(this.channels[c].key===channel)
				return this.channels[c];
		}
		return undefined;
	}

	getChannelProperties(channel) {

		let foundChannel=this._findChannel(channel);
		if(foundChannel) {
			return foundChannel;
		} else {
			//console.log(`Request for [${channel}] that doesn't exits`);
			return undefined;
		}
	}

	getChannelSubsColor(channel,categoryLevel1,categoryLevel2,categoryLevel3) {
		let subs=this.getChannelSubs(channel);
		let col=findArrayObject(subs,"name",categoryLevel1);
		if(col&&col.color)
			return col.color;
		return '#000';

	}

	getChannelSubs(channel) {
		let foundChannel=this._findChannel(channel);
		if(foundChannel) {
			return foundChannel.subCategories;
		} else {
			return undefined;
		}
	}

	getChannelMapIcon(channel,tags,defaultIcon) {
		let chan=this.getChannelProperties(channel);
		if(chan===undefined)
			return undefined;
		let icon=chan.mapIcon;
		if(chan.mapIcon===undefined)
			icon=defaultIcon;
		if(tags&&tags[0]!==undefined) {
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