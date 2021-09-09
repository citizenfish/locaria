import {Circle, Text, RegularShape, Fill, Stroke, Style,Icon} from 'ol/style.js';
import markerHome from '../../locus/components/images/marker-home.svg';
import markerPolling from '../../locus/components/images/marker-polling.svg';
import markerThing from '../../locus/components/images/marker-thing.svg';
import markerTPO from '../../locus/components/images/marker-tpo.svg';
import marker from '../../locus/components/images/marker.svg';


export function viewStyle(feature, resolution) {

	let type=feature.get('type');
	if(!type)
		type=feature.get('description').type;

	const geometry=feature.getGeometry();
	if(geometry.getType()==='Point') {
		switch(type) {
			case 'location':

				return [
					new Style({
						image: new Icon({
							src: markerHome,
							size: [40,70],
							zIndex: 100,
							anchor:[0.5,0.5]


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

			case 'location_big':

				return [
					new Style({
						image: new Icon({
							src: marker,
							size: [40,90],
							zIndex: 100,
							anchorOrigin: 'top-left',
							anchor:[0.5,0.5],
							anchorXUnits: 'fraction',
							anchorYUnits: 'fraction'


						})
					})
				]

			case 'polling_station':
				return [
					new Style({
						image: new Icon({
							src: markerPolling,
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
							src: markerTPO,
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
							src: markerThing,
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
		if(type==='|')
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