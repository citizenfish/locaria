import {Circle, Text, RegularShape, Fill, Stroke, Style,Icon} from 'ol/style.js';
import {MultiPoint} from 'ol/geom.js';


export function mainMapStyle(feature, resolution) {
	const geometry=feature.getGeometry();
	if(geometry.getType()==='Point') {
		let type=feature.get('type');
		if(!type)
			type=feature.get('description').type;
		switch(type) {
			case 'polling_station':
				return [
						new Style({
							image: new Icon({
								src: 'images/marker-polling.svg',
								size: [40, 70],
								zIndex: 100
							}),
							text: new Text({
								text: 'Polling station',
								font: 'bold 11px "Soleil"',
								textBaseline: 'bottom',
								offsetY: 50,
								fill: new Fill({
									color: '#000000'
								}),
								stroke: new Stroke({
									color: '#FFFFFF',
									width: 3.5
								})
							})
						})
					];
			default:
				return [
					new Style({
						image: new Icon({
							src: 'images/marker-thing.svg',
							size: [40, 70],
							zIndex: 100
						}),
						text: new Text({
							text: type||'unknown',
							font: 'bold 11px "Soleil"',
							textBaseline: 'bottom',
							offsetY: 50,
							fill: new Fill({
								color: '#000000'
							}),
							stroke: new Stroke({
								color: '#FFFFFF',
								width: 3.5
							})
						})
					})
				];

		}
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
					size: [40,70],
					zIndex: 100
				}),
				text: new Text({
					text: 'Your location',
					font: 'bold 11px "Soleil"',
					textBaseline: 'bottom',
					offsetY: 50,
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
