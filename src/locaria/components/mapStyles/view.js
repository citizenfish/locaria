import {Circle, Text, RegularShape, Fill, Stroke, Style, Icon} from 'ol/style.js';
import markerHome from '../../../theme/default/images/marker-home.svg';
import marker from "../../../theme/default/images/marker.svg"
import UrlCoder from "../../libs/urlCoder";
const url=new UrlCoder();


/**
 *  Style for location item
 * @param feature
 * @param resolution
 * @returns {Style[]}
 */
export function locationStyle(feature, resolution) {

	let type=feature.get('featureType');
	if (type === 'home') {
		return [
			new Style({
				image: new Icon({
					src: markerHome,
					size: [40, 70],
					anchorOrigin: 'top-left',
					anchor: [0.5, 0.5],
					anchorXUnits: 'fraction',
					anchorYUnits: 'fraction',
					scale: 0.75

				}),
				text: new Text({
					text: 'Your location',
					font: 'bold 11px "Soleil"',
					textBaseline: 'bottom',
					offsetY: -30,
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

/**
 *  Linked style for nmrn (legacy)
 * @returns {Style}
 */
const linkedFeatureStyle = () => {
	return  new Style({
		zIndex: 50,
		image: new Circle({

			radius: 5,
			stroke: new Stroke({
				color: "rgba(0,0,0,0.75)",
				width: 1,
			}),
			fill: new Fill({
				color: "rgba(255,0,0,0.5)"
			})
		})
	})
}

/**
 *  Linked style for nmrn (legacy)
 * @returns {Style}
 */
export function  boundaryStyle (feature,resolution,ol)  {
	return new Style({
			stroke: new Stroke({
				color: [22, 22, 22, 1],
				width: 2
			})
		});
}


/**
 * Style for category & subs
 * @param feature
 * @param resolution
 * @param ol
 */
export function categoryStyle(feature,resolution,ol) {

	let category = feature.get('category');
	let data = feature.get('data');
	let description = feature.get('description');
	let label=description.title;
	let subsColor = window.systemCategories.getChannelSubsColor(category,data.categoryLevel1,data.categoryLevel2,data.categoryLevel3);
	const geometry = feature.getGeometry();

	let radius=10;
	if(resolution>10)
		radius=5;

	if (geometry.getType() === 'Point') {
		return  new Style({
			zIndex: 50,
			image: new Circle({

				radius: radius,
				stroke: new Stroke({
					color: "rgba(0,0,0,0.75)",
					width: 1,
				}),
				fill: new Fill({
					color: subsColor
				})
			}),
			text: new Text({
				text: label,
				font: 'bold 11px "Soleil"',
				textBaseline: 'bottom',
				offsetY: 30,
				fill: new Fill({
					color: '#000000'
				}),
				stroke: new Stroke({
					color: '#FFFFFF',
					width: 3.5
				})
			})
		})
	} else {
		let fill = [255, 0, 0, 0.3];
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


/**
 *  Old default style with svg icons
 * @param feature
 * @param resolution
 * @param ol
 * @returns {[Style,Style]|[Style]}
 */
const defaultFeatureStyle = (feature,resolution,ol) => {
	let category = feature.get('category');
	let tags = feature.get('tags');
	let description = feature.get('description');
	let icon = window.systemCategories.getChannelMapIcon(category, tags);
	let subs = window.systemCategories.getChannelSubs(category);
	if (icon === undefined) {
		icon =  marker
	}
	icon=url.decode(icon,true);
	const geometry = feature.getGeometry();
	if (geometry.getType() === 'Point') {
		let label = category;
		if (tags && tags[0]) {
			label = tags[0];
		}
		if(description&&description.title) {
			label = description.title;
		}
		if(ol.isHighlighted("default",feature.get('fid'))) {
			return [
				new Style({
					zIndex: 1000,
					image: new Icon({
						src: icon,
						size: [40, 70],
						scale: 0.5,
						anchorOrigin: 'top-left',
						anchor: [0.5, 0.5],
						anchorXUnits: 'fraction',
						anchorYUnits: 'fraction',
					})
				}),
				new Style({
					zIndex: 999,
					image: new Circle({

						radius: 20,
						stroke: new Stroke({
							color: "rgba(0,0,0,0.75)",
							width: 1,
						}),
						fill: new Fill({
							color: "rgba(255,0,0,0.5)"
						})
					})
				})
			]
		}

		if(resolution<10) {
			return [
				new Style({
					zIndex: 100,
					image: new Icon({
						src: icon,
						size: [40, 70],
						scale: 0.5,
						anchorOrigin: 'top-left',
						anchor: [0.5, 0.5],
						anchorXUnits: 'fraction',
						anchorYUnits: 'fraction',
					}),
					text: new Text({
						text: label,
						font: 'bold 11px "Soleil"',
						textBaseline: 'bottom',
						offsetY: 30,
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
			return [
				new Style({
					zIndex: 100,
					image: new Icon({
						src: icon,
						size: [40, 70],
						scale: 0.5,
						anchorOrigin: 'top-left',
						anchor: [0.5, 0.5],
						anchorXUnits: 'fraction',
						anchorYUnits: 'fraction',
					})
				})
			]
		}
	} else {
		let fill = [255, 0, 0, 0.3];
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

export function reportStyle(feature,resolution,ol) {
	const featureType=feature.get('featureType');
	if(featureType==='linked_item') {
		return linkedFeatureStyle();
	}
	return defaultFeatureStyle(feature,resolution,ol);
}

export function viewStyle(feature, resolution,ol) {
	// Clustering? Lets revise to one feature
	feature = (feature.get('features') !== undefined ? feature.get('features')[0] : feature);

	let cluster = feature.get('geometry_type');
	if (cluster === "cluster") {
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

	return defaultFeatureStyle(feature,resolution,ol);


}

const styleSettings = {
	roadStroke:   [128, 128, 128, 1],
	roadWidth: 25,
	roadLineCap: 'round',
	roadLineJoin: 'bevel',
	roadLabelSize: 17,
	roadLabelTextBaseline: 'middle',
	roadLabelStroke: [255, 255, 255],
	roadLabelFill: [255, 255, 255],
	greenspaceFill: [0,255,0,0.1],
	backgroundFill:[128, 128, 128,0.1],
	surfaceWaterFill: [0, 0, 255,0.1],
	buildingFill: [250, 218, 180, 0.3],
	buildingStroke:[250, 218, 180, 0.7],
	areaFontSize: 100,
	areaStroke: [255, 255, 255,0.9],
	areaFill: [128, 128, 128, 1],
	areaWidth: 7,
	font: '"Montserrat"',
	noprint: []
}

export function vectorStyle(feature, resolution,ol) {
	let type = feature.get('layer')||'';

	if(type === 'Roads' && styleSettings.noprint.indexOf('Roads') === -1){
		let width = Math.round(styleSettings.roadWidth/resolution)
		return [
			new Style({
				stroke: new Stroke({
					color: styleSettings.roadStroke,
					width: width,
					lineCap : styleSettings.roadLineCap,
					lineJoin: styleSettings.roadLineJoin
				})
			})
		]
	}

	if(type === 'Roads/label' && resolution < 2.5 && styleSettings.noprint.indexOf('Roads/label') === -1) {
		let name = feature.get('_name').toUpperCase()
		let font_size = Math.round(styleSettings.roadLabelSize/resolution)
		return [
			new Style({
				text: new Text({
					text: name,
					textBaseline: styleSettings.roadLabelTextBaseline,
					font: `${font_size}px ${styleSettings.font}`,
					placement: 'line',
					stroke: new Stroke(
						{color: styleSettings.roadLabelStroke}
					),
					fill: new Fill({color: styleSettings.roadLabelFill})
				})
			})
		]
	}

	if(type.match(/Greenspace|Woodland/) && styleSettings.noprint.indexOf('Greenspace') === -1) {
		return [
			new Style({
				fill: new Fill({
					color: styleSettings.greenspaceFill
				})
			})
		]
	}

	if(type === 'Background' && styleSettings.noprint.indexOf('Background') === -1) {
		return [
			new Style({
				fill: new Fill({
					color: styleSettings.backgroundFill
				})
			})
		]
	}

	if(type === 'Surfacewater' && styleSettings.noprint.indexOf('Surfacewater') === -1) {
		return [
			new Style({
				fill: new Fill({
					color: styleSettings.surfaceWaterFill
				})
			})
		]
	}

	if((type === 'Local_buildings' || type === 'Functional_sites' || type === 'Sites') && styleSettings.noprint.indexOf('Buildings') === -1 ) {
		return [
			new Style({
				fill: new Fill({
					color: styleSettings.buildingFill
				}),
				stroke: new Stroke(
					{
						color: styleSettings.buildingStroke
					}
				)
			})
		]
	}
	if(type.match(/Suburban/) && resolution >= 2.5 && styleSettings.noprint.indexOf('Suburban') === -1){
		let name = feature.get('_name').toUpperCase()
		let font_size = Math.round(styleSettings.areaFontSize/resolution)
		return [
			new Style({
				text: new Text({
					text: name,
					font: `${font_size}px ${styleSettings.font}`,
					placement: 'point',
					stroke: new Stroke({color: styleSettings.areaStroke, width: styleSettings.areaWidth}),
					fill: new Fill({color: styleSettings.areaFill})
				})
			})
		]
	}

}