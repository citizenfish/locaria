import {Circle, Text, RegularShape, Fill, Stroke, Style,Icon} from 'ol/style.js';
import {MultiPoint} from 'ol/geom.js';


export function mainMapStyle(feature, resolution) {
	let type=feature.get('type');
	if(!type)
		type=feature.get('description').type;

	const geometry=feature.getGeometry();
	if(geometry.getType()==='Point') {
		switch(type) {
			case 'polling_station':
				return [
						new Style({
							image: new Icon({
								src: 'images/marker-polling.svg',
								size: [40, 70],
								zIndex: 100,
								anchor:[0.5,1]
							}),
							text: new Text({
								text: 'Polling station',
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
					];
			case 'Tree Preservation Order':
				return [
					new Style({
						image: new Icon({
							src: 'images/marker-tpo.svg',
							size: [40, 70],
							zIndex: 100,
							anchor:[0.5,1]
						}),
						text: new Text({
							text: 'Tree Preservation Order',
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
				];
			default:

				return [
					new Style({
						image: new Icon({
							src: 'images/marker-thing.svg',
							size: [40, 70],
							zIndex: 100,
							anchor:[0.5,1]

						}),
						text: new Text({
							text: type||'unknown',
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
				];

		}
	} else {
		let fill=[255, 0, 0, 0.3];
		if(type==='Tree Preservation Order')
			fill=[0, 255, 0, 0.3];
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


export function locationStyle(feature, resolution) {
	const geometry=feature.getGeometry();
		return [
			new Style({
				image: new Icon({
					src: 'images/marker-home.svg',
					size: [40,70],
					zIndex: 100,
					anchor:[0.5,1]


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
