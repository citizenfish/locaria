import {Circle, Text, RegularShape, Fill, Stroke, Style} from 'ol/style.js';
import {MultiPoint} from 'ol/geom.js';


export function mainMapStyle(feature, resolution) {
	const geometry=feature.getGeometry();
	if(geometry==='Point') {
		return [
			new Style({
				image: new RegularShape({
					radius: 10,
					points: 3,
					angle: 0,
					fill: new Fill({
						color: [229, 172, 87, 1]
					}),
					stroke: new Stroke({
						color: [22, 22, 22, 1],
						width: 1
					}),
					zIndex: 100
				})
			})
		]
	} else {
		return [
			new Style({
				stroke: new Stroke({
					color: [22, 22, 22, 1],
					width: 1
				}),
				fill: new Fill({
					color: [255, 0, 0, 0.3],
					width: 1
				})
			})
		]
	}

}
