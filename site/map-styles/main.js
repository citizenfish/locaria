import {Circle, Text, RegularShape, Fill, Stroke, Style} from 'ol/style.js';
import {MultiPoint} from 'ol/geom.js';


export function mainMapStyle(feature, resolution) {
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
}
