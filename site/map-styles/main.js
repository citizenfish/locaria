import {Circle, Text, RegularShape, Fill, Stroke, Style,Icon} from 'ol/style.js';
import {MultiPoint} from 'ol/geom.js';


export function mainMapStyle(feature, resolution) {
	const geometry=feature.getGeometry();
	if(geometry.getType()==='Point') {
		return [
			new Style({
				image: new Icon({
					src: 'images/marker-thing.svg',
					size: [40,60],
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


export function locationStyle(feature, resolution) {
	const geometry=feature.getGeometry();
		return [
			new Style({
				image: new Icon({
					src: 'images/marker-home.svg',
					size: [40,60],
					zIndex: 100
				})
			})
		]
}
