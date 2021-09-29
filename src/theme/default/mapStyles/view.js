import {Circle, Text, RegularShape, Fill, Stroke, Style, Icon} from 'ol/style.js';
import markerHome from '../images/marker-home.svg';
import markerPolling from '../images/marker-polling.svg';
import markerThing from '../images/marker-thing.svg';
import markerTPO from '../images/marker-tpo.svg';
import marker from '../images/marker.svg';

import {configs,channels} from "theme_locus";

export function locationStyle(feature, resolution) {
	return [
		new Style({
			image: new Icon({
				src: marker,
				size: [40, 90],
				zIndex: 100,
				anchorOrigin: 'top-left',
				anchor: [0.5, 0.5],
				anchorXUnits: 'fraction',
				anchorYUnits: 'fraction',
				scale: 1.5


			})
		})
	]
}

export function viewStyle(feature, resolution) {
	// Clustering? Lets revise to one feature
	feature = (feature.get('features') !== undefined ? feature.get('features')[0] : feature);

	let category = feature.get('category');
	let tags = feature.get('tags');

	let cluster=feature.get('geometry_type');
	if(cluster==="cluster") {
		let size = feature.get('count');
		let color = size > 25 ? "192,0,0" : size > 8 ? "255,128,0" : "0,128,0";
		let radius = Math.max(8, Math.min(size * 0.75, 20));
		let dashItem = 2 * Math.PI * radius / 6;
		let dash = [0, dashItem, dashItem, dashItem, dashItem, dashItem, dashItem];
		let style = new Style({
			image: new Circle({
				radius: radius,
				stroke: new Stroke({
					color: "rgba(" + color + ",0.5)",
					width: 15,
					lineDash: dash,
					lineCap: "butt"
				}),
				fill: new Fill({
					color: "rgba(" + color + ",1)"
				})
			}),
			text: new Text({
				text: size.toString(),
				//font: 'bold 12px comic sans ms',
				//textBaseline: 'top',
				fill: new Fill({
					color: '#fff'
				})
			})
		});
		return style;
	}

	if(category==='location') {
		return [
			new Style({
				image: new Icon({
					src: markerHome,
					size: [40, 70],
					zIndex: 100,
					anchorOrigin: 'top-left',
					anchor: [0.5, 0.5],
					anchorXUnits: 'fraction',
					anchorYUnits: 'fraction',


				}),
				text: new Text({
					text: 'Your location',
					font: 'bold 11px "Soleil"',
					textBaseline: 'bottom',
					offsetY: 15,
					fill: new Fill({
						color: '#000000'
					}),
					stroke: new Stroke({
						color: '#FFFFFF',
						width: 3.5
					})
				})
			})
		]
	}

	let channel=channels.getChannelProperties(category);

	let icon=channels.getChannelMapIcon(category,tags);
	if(icon===undefined)
		icon=configs.defaultMapIcon;
	const geometry = feature.getGeometry();
	if (geometry.getType() === 'Point') {

	return [
		new Style({
			image: new Icon({
				src: icon,
				size: [40, 70],
				zIndex: 100,
				anchorOrigin: 'top-left',
				anchor: [0.5, 0.5],
				anchorXUnits: 'fraction',
				anchorYUnits: 'fraction',
			}),
			text: new Text({
				text: tags[0]? tags[0]:category,
				font: 'bold 11px "Soleil"',
				textBaseline: 'bottom',
				offsetY: 15,
				fill: new Fill({
					color: '#000000'
				}),
				stroke: new Stroke({
					color: '#FFFFFF',
					width: 3.5
				})
			})
		})
	]
	} else {
		let fill = [255, 0, 0, 0.3];
		if (type === '|')
			fill = [0, 255, 0, 0.3];
		return [
			new Style({
				stroke: new Stroke({
					color: [22, 22, 22, 1],
					width: 1
				}),
				fill: new Fill({
					color: fill,
					width: 1
				})
			})
		]
	}

}