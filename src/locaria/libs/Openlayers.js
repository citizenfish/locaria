/** @module Openlayers */
import {Map, View, Feature} from 'ol';
import {getWidth, getTopLeft} from 'ol/extent.js';

import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Heatmap from 'ol/layer/Heatmap';
import VectorSource from 'ol/source/Vector';
import Cluster from 'ol/source/Cluster';
import {Point} from 'ol/geom.js';

import Disposable from 'ol/Disposable';
import OSM from 'ol/source/OSM';
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import XYZ from 'ol/source/XYZ.js';
import TileWMS from 'ol/source/TileWMS';

import AnimatedCluster from 'ol-ext/layer/AnimatedCluster'

import WKT from 'ol/format/WKT';
import Overlay from 'ol/Overlay';
import {unByKey} from 'ol/Observable'


import GeoJSON from 'ol/format/GeoJSON';
import {fromLonLat, units, epsg3857, epsg4326} from 'ol/proj';

import Select from 'ol/interaction/Select';


import proj4 from "proj4";
import {register} from 'ol/proj/proj4';
import {get as getProjection} from 'ol/proj'

import {transform} from 'ol/proj';
import {METERS_PER_UNIT} from 'ol/proj';

import {defaults as defaultInteractions, DragRotateAndZoom} from 'ol/interaction';


import {v4 as uuidv4} from 'uuid';

import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import buffer from '@turf/buffer';


proj4.defs([
	["EPSG:27700", "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +datum=OSGB36 +units=m +no_defs"]
]);

register(proj4);


/**
 * @classdesc
 *
 * Openlayers Hook
 *
 * @author Richard Reynolds richard@nautoguide.com
 *
 * @example
 * //
 *
 * @description You need to add "ol": "^5.3.0" to your package.json to build with openlayers
 *
 */
export default class Openlayers {


	constructor() {
		this.maps = {};
	}

	/**
	 *
	 * Create a new map
	 * @param {int} pid - process ID
	 * @param {object} json - queue arguments
	 * @param {string} json.map - name for the map (used to reference)
	 * @param {string} json.target - id of element in the page to target
	 * @param {int} json.zoom - initial zoom level
	 * @param {int} json.maxZoom - Maximum zoom
	 * @param {array} json.center - Center on
	 * @param {string} json.renderer - Renderers to use
	 * @example
	 * openlayer.addMap();
	 *
	 */
	addMap(options) {
		let self = this;
		options = Object.assign({
			"map": "default",
			"maxZoom": 25,
			"zoom": 0,
			"renderer": ['webgl', 'canvas'],
			"target": "map",
			"center": [0, 0],
			"projection": "EPSG:3857",
			"debug": false,
			"enableEvents": true,
			"keyboardEventTarget": "body",
			"pixelRatio": 1,
			"maxTilesLoading": 16,
			"loadStateEnabled": true
		}, options);
		let kt = document.querySelector(options.keyboardEventTarget);
		let projection = getProjection(options.projection);
		const map = new Map({
			target: options.target,
			view: new View({
				center: options.center,
				zoom: options.zoom,
				maxZoom: options.maxZoom,
				renderer: options.renderer,
				projection: projection,
				resolutions: options.resolutions,
				extent: options.extent,
				pixelRatio: options.pixelRatio,
				maxTilesLoading: options.maxTilesLoading
				}
			),
			interactions: defaultInteractions().extend([
				new DragRotateAndZoom()
			]),
			keyboardEventTarget: kt,
			controls: []

		});
		if (options.debug === true) {

			map.on('moveend', self._debug);
		}

		// We keep an object and all the maps with our additions
		self.maps[options.map] = {
			"object": map,
			"layers": {},
			zoom: map.getView().getZoom(),
			"controls": {},
			"layerLoadState": false,
			"loadStateEnabled": options.loadStateEnabled,
			"timeout1": undefined,
			"timeout2": undefined,
			"eventsEnabled": options.enableEvents,
			"selected":[],
			"highlighted":[]
		};

	}


	addResolutionEvent(options) {
		let self = this;
		options = Object.assign({
			"map": "default"
		}, options);
		let map = self.maps[options.map].object;
		map.getView().on('propertychange', function (e) {
			switch (e.key) {
				case 'resolution': {
					/**
					 *  Check for judder - We only want zoom events that are not a transition
					 */
					let level = Math.round(map.getView().getZoom());
					let zoomLevel = self.maps[options.map].zoom;

					if (zoomLevel !== level || map.getView().getZoom() % 1 === 0) {
						// Silent Fail this as its not critical
						clearTimeout(self.maps[options.map].timeout1);
						self.maps[options.map].timeout1 = setTimeout(function () {
							options.changeFunction(self.updateResolution({"map": options.map}));
						}, 500)
					}
					self.maps[options.map].zoom = level;
					break;
				}
				case 'center': {
					if (self.maps[options.map].eventsEnabled) {
						clearTimeout(self.maps[options.map].timeout2);
						self.maps[options.map].timeout2 = setTimeout(function () {
							options.changeFunction(self.updateResolution({"map": options.map}));
						}, 500)
					}
				}
			}


		});
	}

	updateResolution(options) {
		let self = this;
		options = Object.assign({
			"map": "default"
		}, options);
		let map = self.maps[options.map].object;
		let view = map.getView();
		let level = Math.round(map.getView().getZoom());
		let unit = map.getView().getProjection().getUnits();
		let extent = map.getView().calculateExtent(map.getSize());
		let extent43261 = transform([extent[0], extent[1]], view.getProjection().getCode(), "EPSG:4326");
		let extent43262 = transform([extent[2], extent[3]], view.getProjection().getCode(), "EPSG:4326");
		return (
			{
				"zoom": level,
				"resolution": map.getView().getResolution(),
				"center": map.getView().getCenter(),
				"extent": extent,
				"extent4326": [extent43261[0], extent43261[1], extent43262[0], extent43262[1]],
				"unit": unit,
				"scale": map.getView().getResolution() * METERS_PER_UNIT[unit] * 39.37 * 72,
				"size": map.getSize()
			});

	}


	/**
	 *
	 * Add a layer to the map
	 * @param {int} pid - process ID
	 * @param {object} json - queue arguments
	 * @param {string} json.map - name for the map (used to reference)
	 * @param {string} json.name - name for the layer (used to reference)
	 * @param {string} json.typr - Layer type osm,vector
	 * @param {float} json.opacity - layer opacity
	 * @param {boolean} json.transparent - is the layer transparent?
	 * @param {string} json.style - Style object to use
	 * @param {boolean} json.active - Is the layer active
	 * @param {boolean} json.loadIgnore - Ignore this layer for loadchecking
	 * @param {object|string} json.geojson - geojson to add to the layer (vector)
	 * @example
	 * openlayer.addLayer();
	 *
	 */

	addLayer(options) {
		let self = this;
		options = Object.assign({
			"map": "default",
			"name": "default",
			"opacity": 1,
			"transparent": false,
			"active": true,
			"loadIgnore": false,
			"debug": false,
			"attributions": []
		}, options);
		let map = self.maps[options.map].object;
		let olLayer = null;

		/*
		 * If we had a style specified then we need to check if it needs expanding
		 */
		if (options.style !== undefined && typeof options.style !== 'object')
			options.style = eval(options.style);

		/*
		 * Find the requested layer type as a function
		 */
		let layerFunction = self["_addLayer_" + options.type];
		if (typeof layerFunction === "function") {
			olLayer = layerFunction.apply(self, [options]);
		} else {
			console.log(`"No add layer function for ${options.type}`)
			return false;
		}
		/*
        * Add the layer and update the the maps object with the new layers
        */
		map.addLayer(olLayer);

		/*
		 * Add our own values to the layer so we can track loading states
		 */

		self.maps[options.map].layers[options.name] = olLayer;

	}


	/**
	 * Add an osm layer
	 * @param options
	 * @return {TileLayer}
	 * @private
	 */
	_addLayer_osm(options) {
		let olLayer = new TileLayer({
			source: new OSM()
		});
		return olLayer;
	}


	/**
	 * Add an osm layer
	 * @param options
	 * @return {TileLayer}
	 * @private
	 */
	_addLayer_animatedCluster(options) {
		options = Object.assign({
			distance: 40,
			animationDuration: 700
		}, options);

		//let source = this._addLayer_vector(options).getSource();


		let clusterSource = new Cluster({
			distance: options.distance,
			source: new VectorSource({})
		});


		let olLayer = new AnimatedCluster({
			name: options.name,
			source: clusterSource,
			style: options.style,
			animationDuration: options.animationDuration,
			visible: options.active,
			opacity: options.opacity,
			cluster: true,

		});
		return olLayer;
	}

	/**
	 * Add an wmts layer
	 * @param options
	 * @return {TileLayer}
	 * @private
	 */
	_addLayer_wmts(options) {
		let self = this;
		let map = self.maps[options.map].object;
		let view = map.getView();
		let source = new WMTS({
			url: options.url,
			layer: options.layer,
			matrixSet: options.matrixSet,
			format: 'image/png',
			crossOrigin: 'anonymous',
			projection: view.getProjection(),
			tileGrid: new WMTSTileGrid({
				resolutions: view.getResolutions(),
				matrixIds: options.matrix,
				origin: options.origin

			})
		});
		let olLayer = new TileLayer({
			extent: options.extent,
			opacity: options.opacity,
			visible: options.active,
			name: options.name,
			source: source
		});

		return olLayer;

	}

	/**
	 * Add a wms layer
	 * @param options
	 * @return {TileLayer}
	 * @private
	 */
	_addLayer_wms(json) {
		let options = Object.assign({
			serverType: '',
			params: {},
			crossOrigin: null,
			hidpi: true
		}, json);
		let source = new TileWMS({
			url: options.url,
			crossOrigin: options.crossOrigin,
			params: options.params,
			serverType: options.serverType,
			hidpi: options.hidpi
		});
		let olLayer = new TileLayer({
			extent: options.extent,
			opacity: options.opacity,
			visible: options.active,
			name: options.name,
			source: source
		});
		return olLayer;
	}

	/**
	 * Add an xyz layer
	 * @param options
	 * @return {TileLayer}
	 * @private
	 */
	_addLayer_xyz(options) {
		let self = this;
		let source = new XYZ({
			url: options.url,
			crossOrigin: 'Anonymous',
			attributions: options.attributions
		});
		let olLayer = new TileLayer({
			extent: options.extent,
			opacity: options.opacity,
			visible: options.active,
			name: options.name,
			source: source,
		});
		return olLayer;
	}

	/**
	 * Add a heatmap layer
	 * @param options
	 * @return {VectorLayer}
	 * @private
	 */
	_addLayer_heatmap(options) {
		let source = {};
		let vectorSource;
		if (options.geojson !== undefined) {
			source.features = this._loadGeojson(options.map, options.geojson);
		}
		vectorSource = new VectorSource(source);
		let olLayer = new Heatmap({
			name: options.name,
			visible: options.active,
			source: vectorSource,
			opacity: options.opacity,
		});
		return olLayer;
	}

	/**
	 * Add a vector layer
	 * @param options
	 * @return {VectorLayer}
	 * @private
	 */
	_addLayer_vector(options) {
		let self = this;
		let source = {};
		let vectorSource;
		if (options.geojson !== undefined) {
			source.features = this._loadGeojson(options.map, options.geojson);
		}
		vectorSource = new VectorSource(source);
		let olLayer = new VectorLayer({
			name: options.name,
			visible: options.active,
			source: vectorSource,
			style: options.style,
			opacity: options.opacity,
			selectable: options.selectable,
			hover: options.hover
		});
		return olLayer;
	}

	/**
	 * Make a new control
	 *
	 * @param pid
	 * @param json
	 * @param {string} json.map - Map name
	 * @param {string} json.mode -  on|off
	 * @param {array} json.name - What to call it (used later to reference)
	 * @param {array} json.control - The control function to use
	 *
	 */
	makeControl(options) {
		let self = this;
		options = Object.assign({
			"map": "default",
			"mode": "on",
			"control": "simpleSelect",
			"name": "ss"
		}, options);
		let map = self.maps[options.map].object;
		let control;
		/*
		 * Find the requested control type as a function
		 */
		let controlFunction = self["_control_" + options.control];
		if (typeof controlFunction === "function") {
			control = controlFunction.apply(self, [options]);
		} else {
			return false;
		}

		self.maps[options.map].controls[options.name] =
			{
				state: options.mode,
				parent: "_control_" + options.control,
				obj: control
			};

		if (options.mode === "on") {
			if (control.getActive)
				map.addInteraction(control);
			else
				map.addControl(control);
		}
	}

	/**
	 * trigger a controls(s) sub functions (init is default) See example in simple select for how to code for this
	 * @param pid
	 * @param json
	 * @param {string} json.map - Map name
	 * @param {string} json.function -  function to call
	 * @param {array} json.name - control to call
	 *
	 */

	controlTrigger(pid, json) {
		let self = this;
		let options = Object.assign({
			"map": "default",
			"name": "ss",
			"function": "test"
		}, json);
		let control = self.maps[options.map].controls[options.name];
		let controlFunction = self[control.parent];
		options.obj = control.obj;
		controlFunction.apply(self, [options]);
		self.finished(pid, self.queue.DEFINE.FIN_OK);

	}

	/**
	 * Set a controls(s) to the requested mode and set others to opposit state
	 * @param pid
	 * @param json
	 * @param {string} json.map - Map name
	 * @param {string} json.mode -  on|off
	 * @param {array} json.name - control to set
	 *
	 */
	controlSet(pid, json) {
		let self = this;
		let options = Object.assign({
			"map": "default",
			"names": ["ss"]
		}, json);
		let map = self.maps[options.map].object;
		let controls = self.maps[options.map].controls;

		/*
		 * Toggle out all controls. We do this rather than be selective
		 * due to snap always needing to be the last added
		 */
		for (let i in controls) {
			this._toggleControl(map, controls[i], 'off');

		}

		/*
		 * Toggle in the ones we do need (in order this is important for the likes of snap
		 */
		for (let i in options.names) {
			this._toggleControl(map, controls[options.names[i]], 'on');
		}
		self.finished(pid, self.queue.DEFINE.FIN_OK);
	}

	/**
	 * Set a controls(s) to the requested mode and set others to opposit state
	 * @param pid
	 * @param json
	 * @param {string} json.map - Map name
	 * @param {string} json.mode -  on|off
	 * @param {array} json.name - control to set
	 *
	 */
	controlToggle(pid, json) {
		let self = this;
		let options = Object.assign({
			"map": "default",
			"names": ["ss"],
			"mode": "toggle"
		}, json);
		let map = self.maps[options.map].object;
		let controls = self.maps[options.map].controls;
		/*
		 * Toggle in the ones we do need (in order this is important for the likes of snap
		 */
		if (options.names === '*')
			options.names = Object.keys(self.maps[options.map].controls);
		for (let i in options.names) {
			this._toggleControl(map, controls[options.names[i]], options.mode);
		}
		self.finished(pid, self.queue.DEFINE.FIN_OK);
	}

	/**
	 * Toggle a control between on/off
	 * @param map
	 * @param control
	 * @private
	 */
	_toggleControl(map, control, mode) {
		if (control.state === 'on' && (mode === 'off' || mode === 'toggle')) {
			try {
				map.removeInteraction(control.obj);
				map.removeControl(control.obj);
			} catch (e) {

			}
			control.state = 'off';
		}
		if (control.state === 'off' && (mode === 'on' || mode === 'toggle')) {
			try {
				map.addInteraction(control.obj);
				map.addControl(control.obj);
			} catch (e) {

			}
			control.state = 'on';
		}
	}

	/**
	 *
	 *   CONTROLS
	 *
	 *
	 */


	/**
	 * Use the standard openlayers select control
	 * @param json
	 * @param {string} json.map - Map name
	 * @param {string} json.mode -  on|off
	 * @param {string} json.perfix - prefix to use
	 * @param {array} json.layers - layers to use
	 *
	 * @description This select control uses the default openlayers model. Useful for applications with no overlapping features. It does not support selecting hidden features
	 */
	_control_simpleSelect(json) {
		let self = this;
		let options = Object.assign({
			"map": "default",
			"mode": "on",
			"function": "init",
			"prefix": "",
			"style": "",
			"multi": false
		}, json);


		switch (options.function) {
			case 'deselect':
				return deselect();
			case 'manualSelect':
				return manualSelect();
			default:
				return init();

		}

		function init() {
			if (options.layers) {
				for (let i in options.layers) {
					options.layers[i] = self.maps[options.map].layers[options.layers[i]];
				}
			}

			let control = new Select({
				"multi": options.multi,
				"layers": options.layers,
				"style": options.style,
				"toggleCondition": function () {
					return false;
				}
			});
			control.on('select', selectFunction);
			return control;
		}

		function deselect() {
			let features = options.obj.getFeatures();
			features.clear();
			return true;
		}

		function manualSelect() {
			let control = self.maps[options.map].controls[options.name].obj;
			let layer = self.maps[options.map].layers[options.layer];
			let source = layer.getSource();
			let feature = self._featureSearch(source, options.id);

			control.getFeatures().clear();
			control.getFeatures().push(feature);
			options.selectedFunction([feature]);


		}

		function selectFunction(e) {
			self.setSelected(options.map,options.layer,e.selected);
			if (e.deselected.length > 0 && e.selected.length === 0 && options.deselectectedFunction !== undefined) {
				options.deselectectedFunction(e.selected,self.featuresToGeojson(e.selected));
			}

			if (e.selected.length > 0) {
				options.selectedFunction(e.selected,self.featuresToGeojson(e.selected));
			}

		}


	}


	/**
	 *
	 *  END CONTROLS
	 *
	 */

	/**
	 * Convert a feature of multiPolygon to a featue(s) of Polygons. No properies are copied
	 * @param feature
	 * @returns {[]}
	 * @private
	 */
	_multiFeatureToPolygon(feature) {
		let features = [];
		// Ignore non MultiPolygons
		if (feature.geometry.type === "MultiPolygon") {
			for (let i in feature.geometry.coordinates) {
				features.push({
					type: "Feature",
					geometry: {
						coordinates: feature.geometry.coordinates[i],
						type: "Polygon"
					}
				})
			}
		} else {
			features.push(feature);
		}
		return features;
	}


	/**
	 * Use a filter object to locate features on a single layer
	 * @param pid
	 * @param json
	 * @param {string} json.map - Map name
	 * @param {array} json.layer - layer to use
	 * @param {object} json.filter - Filter eg {"feature_id":1}
	 *
	 */
	findFeatures(pid, json) {
		let options = Object.assign({
			"map": "default",
			"layer": "default",
			"filter": {}
		}, json);
		let foundFeatures = [];
		let layer = this.maps[options.map].layers[options.layer];
		let source = layer.getSource();
		let features = source.getFeatures();
		for (let i in features) {
			for (let f in options.filter) {
				let check = features[i].get(f);
				/*
				 * Note there can be differing types here, hence ==
				 */
				if (check == options.filter[f]) {
					foundFeatures.push(features[i]);
				}
			}
		}
		this.queue.setMemory('findFeatures', foundFeatures, "Session");
		this.queue.setMemory(options.map + 'selectedFeatures', foundFeatures, "Session");
		this.finished(pid, this.queue.DEFINE.FIN_OK);
		return foundFeatures;
	}

	findFeatureByFid(map,layer,fid) {
		let layerObj = this.maps[map].layers[layer];
		let source = layerObj.getSource();
		let features = source.getFeatures();
		for (let i in features) {
			if(features[i].get('fid')===fid)
				return features[i];
		}
		return false;
	}

	/*
	 * Find a feature using search string eg: feature_id:12345
	 */
	_featureSearch(source, searchString) {
		let features = source.getFeatures();

		let feature;
		if (searchString.match(/\:/)) {
			let pattern = searchString.split(":");
			if (pattern[1] === 'true')
				pattern[1] = true;
			for (let i in features) {
				if (features[i].get(pattern[0]) == pattern[1]) {
					feature = features[i];
					break;
				}

			}
		} else {
			feature = source.getFeatureById(searchString);
		}
		return feature;

	}

	/**
	 * Set a features properties by id
	 * @param pid
	 * @param json
	 * @param {string} json.map - Map name
	 * @param {array} json.layer - layer to use
	 * @param {object} json.id - Feature id
	 * @param {object} json.properties - properties to set
	 *
	 */
	setFeaturePropertyById(pid, json) {
		let options = Object.assign({
			"map": "default",
			"layer": "default",
			"id": "",
			"properties": {}
		}, json);
		let layer = this.maps[options.map].layers[options.layer];
		let source = layer.getSource();
		let feature = source.getFeatureById(options.id);
		feature.setProperties(options.properties);
		this.queue.setMemory('updatedFeature', new GeoJSON({
			"dataProjection": "EPSG:4326",
			"featureProjection": "EPSG:3857"
		}).writeFeaturesObject([feature]), "Session");
		this.finished(pid, this.queue.DEFINE.FIN_OK);
	}

	/**
	 * Set  features properties by id
	 * @param pid
	 * @param json
	 * @param {string} json.map - Map name
	 * @param {array} json.layer - layer to use
	 * @param {array} json.id - Feature id array
	 * @param {object} json.properties - properties to set
	 *
	 */
	setFeaturesPropertiesById(pid, json) {
		let options = Object.assign({
			"map": "default",
			"layer": "default",
			"ids": "",
			"properties": {}
		}, json);
		let layer = this.maps[options.map].layers[options.layer];
		let source = layer.getSource();
		let features = [];
		for (let f in options.ids) {
			let feature = source.getFeatureById(options.ids[f]);
			feature.setProperties(options.properties);
			features.push(feature);
		}
		this.queue.setMemory('updatedFeatures', new GeoJSON({
			"dataProjection": "EPSG:4326",
			"featureProjection": "EPSG:3857"
		}).writeFeaturesObject(features), "Session");

		this.finished(pid, this.queue.DEFINE.FIN_OK);
	}

	moveFeatureLayer(pid, json) {
		let options = Object.assign({
			"map": "default",
			"layer": "default",
			"targetLayer": "default",
			"search": "",
		}, json);
		let layer = this.maps[options.map].layers[options.layer];
		let source = layer.getSource();
		let feature = this._featureSearch(source, options.search);
		if (feature) {

			source.removeFeature(feature);

			let targetLayer = this.maps[options.map].layers[options.targetLayer];
			let targetSource = targetLayer.getSource();
			targetSource.addFeature(feature);
			this.queue.setMemory('movedFeature', true, "Session");

		} else {
			this.queue.setMemory('movedFeature', false, "Session");
		}


		this.finished(pid, this.queue.DEFINE.FIN_OK);
	}

	clearHighlighted(map,layer) {
		this.maps[map].highlighted=[];
		this.changed(map,layer);

	}

	setHighlighted(map,layer,fids) {
		this.maps[map].highlighted=fids;
		this.changed(map,layer);
	}

	isHighlighted(map,fid) {
		if(this.maps[map].highlighted.indexOf(fid)!==-1)
			return true;
		return false;
	}

	clearSelected(map,layer) {
		this.maps[map].selected=[];
		this.changed(map,layer);

	}

	setSelected(map,layer,features) {
		this.maps[map].selected=features;
		this.changed(map,layer);
	}

	isSelected(map,fid) {
		if(this.maps[map].selected.indexOf(fid)!==-1)
			return true;
		return false;
	}

	/**
	 * Use the standard click event
	 * @param pid
	 * @param json
	 *
	 * @description This select control uses the default openlayers model. Useful for applications with no overlapping features. It does not support selecting hidden features
	 */
	simpleClick(options) {
		let self = this;
		options = Object.assign({
			"map": "default",
			"mode": "on",
			"clickFunction": undefined
		}, options);
		let map = self.maps[options.map].object;
		if (options.mode === "on") {
			self.maps[options.map].clickTag = map.on('click', clickFunction);
		} else {
			unByKey(self.maps[options.map].clickTag);
		}

		function clickFunction(e) {
			options.clickFunction(e);
		}
	}


	/**
	 * Convert a coordinate to WKT
	 * @param pid
	 * @param json
	 *
	 * @description Convert a coordinate to WKT
	 */
	coordinatesToWKT(options) {
		options = Object.assign({
			"map": "default",
		}, options);
		let olGeom = new Point(options.coordinate);
		let format = new WKT();
		let wktRepresenation = format.writeGeometry(olGeom);
		return wktRepresenation;
	}

	/**
	 * Add a feature to the Map
	 * TODO: This is old code for getting something working. Needs functionising, not for production
	 * @param pid
	 * @param json
	 */
	addFeature(pid, json) {
		let self = this;
		let options = Object.assign({
			"map": "default",
			"layer": "default",
			"values": {}
		}, json);

		let map = self.maps[options.map].object;
		let layer = self.maps[options.map].layers[options.layer];
		let view = map.getView();
		let source = layer.getSource();

		let projection = "EPSG:" + options.geometry.match(/SRID=(.*?);/)[1];
		let wkt = options.geometry.replace(/SRID=(.*?);/, '');

		let format = new WKT();
		let feature = format.readFeature(wkt);
		options.values.geometry = feature.getGeometry().transform(projection, view.getProjection().getCode());
		source.addFeature(new Feature(options.values));
		self.finished(pid, self.queue.DEFINE.FIN_OK);

	}

	/**
	 * Delete features from layer by id
	 * @param pid
	 * @param json
	 * @param {string} json.map - Map reference
	 * @param {string} json.layer - Layer to get extent from
	 * @param {string} json.id - id of feature
	 */
	deleteFeatureById(pid, json) {
		let self = this;
		let options = Object.assign({
			"map": "default",
			"layer": "default",
			"id": ""
		}, json);
		let layer = self.maps[options.map].layers[options.layer];
		let source = layer.getSource();
		let feature = source.getFeatureById(options.id);
		source.removeFeature(feature);
		self.finished(pid, self.queue.DEFINE.FIN_OK);
	}

	/**
	 * Clean and/or default feature properties
	 * @param pid
	 * @param json
	 * @param {string} json.map - Map reference
	 * @param {string} json.layer - Layer to get features from
	 * @param {array} json.delete - Array of properties to delete
	 * @param {array} json.default - Array of objects {name:...,value:...} to default
	 */
	propertiesClean(pid, json) {
		let self = this;
		let options = Object.assign({
			"map": "default",
			"layer": "default",
			"delete": [],
			"default": []
		}, json);
		let layer = self.maps[options.map].layers[options.layer];
		let source = layer.getSource();
		let features = source.getFeatures();
		for (let f in features) {
			for (let d in options.delete) {
				if (features[f].get(d)) {
					features[f].set(d, '');
				}
			}
			for (let d in options.default) {
				if (!features[f].get(options.default[d].name)) {
					features[f].set(options.default[d].name, options.default[d].value);
				}
			}
		}
		self.finished(pid, self.queue.DEFINE.FIN_OK);
	}


	/**
	 * Convert a feature of polygons to a turf polygon of correct type
	 * @param feature
	 * @returns {[]}
	 * @private
	 */
	_featureToTurfPolygon(feature) {
		if (feature.geometry.type === "MultiPolygon") {
			return multiPolygon(feature.geometry.coordinates);
		} else {
			return polygon(feature.geometry.coordinates);
		}
	}


	/**
	 * Add geojson features to a layer
	 * @param pid
	 * @param json
	 * @param {string} json.map - Map reference
	 * @param {string} json.layer - Layer to get extent from
	 * @param {string} json.gejson - geojson
	 */
	addGeojson(options) {
		let self = this;
		options = Object.assign({
			"map": "default",
			"layer": "default",
			"geojson": {},
			"clear": false
		}, options);
		let layer = self.maps[options.map].layers[options.layer];
		let source = layer.getSource();
		if (options.clear === true)
			source.clear();
		let features = this._loadGeojson(options.map, options.geojson);
		source.addFeatures(this._idFeatures(features));
	}

	/**
	 * Openlayers doesn't ID features by default. This will apply a unique id to all features passed to it
	 * @param features
	 * @private
	 */
	_idFeatures(features) {
		for (let i in features) {
			if (features[i].get('uuid') === undefined) {
				let uuid = uuidv4();
				features[i].setId(uuid);
				features[i].set('uuid', uuid);
			} else {
				features[i].setId(features[i].get('uuid'));
			}
		}
		return features;
	}

	/**
	 * gets geojson features to a layer
	 * @param pid
	 * @param json
	 * @param {string} json.map - Map reference
	 * @param {string} json.layer - Layer to get extent from
	 * @param {string} json.prefix - Prefix for memory
	 * @param {string} json.projection - Projection to use
	 * @param {string} json.search - feature search to use (rather than all)
	 */
	getGeojson(pid, json) {
		let self = this;
		let options = Object.assign({
			"map": "default",
			"layer": "default",
			"projection": "EPSG:4326",
			"prefix": "",
			"search": ""
		}, json);
		let map = self.maps[options.map].object;
		let view = map.getView();

		let layer = self.maps[options.map].layers[options.layer];
		let source = layer.getSource();
		let features = source.getFeatures();
		if (options.search) {
			features = [self._featureSearch(source, options.search)];
		}
		let returnJson = new GeoJSON({
			"dataProjection": options.projection,
			"featureProjection": view.getProjection().getCode()
		}).writeFeaturesObject(features);

		self.queue.setMemory(options.prefix + 'getGeojson', returnJson, "Session");

		self.finished(pid, self.queue.DEFINE.FIN_OK);

	}

	/**
	 * Loads geojson from var or object
	 * @param geojson
	 * @private
	 */
	_loadGeojson(map, geojson) {
		let self = this;
		if (typeof geojson === 'object') {
			if (geojson.features)
				return (new GeoJSON({})).readFeatures(geojson, {featureProjection: self.maps[map].object.getView().getProjection()});
			return [];
		} else {
			return (new GeoJSON({})).readFeatures(eval(geojson), {featureProjection: self.maps[map].object.getView().getProjection()});
		}

	}

	/**
	 * turn a features array into gejson
	 * @param toProjection
	 * @param fromProjection
	 * @param features
	 * @private
	 */
	featuresToGeojson(features,toProjection="EPSG:4326", fromProjection="EPSG:3857") {
		let returnJson = new GeoJSON({
			"dataProjection": toProjection,
			"featureProjection": fromProjection
		}).writeFeaturesObject(features);
		return returnJson;
	}

	/**
	 * Remove the data from a layer on the map.
	 * @param pid
	 * @param json
	 * @param {string} json.map - Map reference
	 * @param {string} json.layer - Layer to clear
	 */
	clearLayer(options) {
		let self = this;
		options = Object.assign({
			"map": "default",
			"layer": "default"
		}, options);
		let layer = self.maps[options.map].layers[options.layer];
		if (layer) {
			let source = layer.getSource();
			source.clear();
		} else {
			console.warn(`No such layer [${options.layer}]`);
		}
	}

	/**
	 * Flag a layer as changed (cause redraw).
	 * @param pid
	 * @param json
	 * @param {string} json.map - Map reference
	 * @param {string} json.layer - Layer to flag
	 */
	changed(map,layer) {
		for (let m in this.maps) {
			if (m === map || map === '*') {
				for (let l in this.maps[m].layers) {
					if (l === layer || layer === '*') {
						let layerObj = this.maps[m].layers[layer];
						layerObj.changed();
					}
				}
			}
		}
	}

	/**
	 * Toggle layer on and off
	 * @param pid
	 * @param json
	 * @param {string} json.map - Map reference
	 * @param {string} json.layer - Layer to clear
	 */
	toggleLayer(pid, json) {
		let options = Object.assign({
			"map": "default",
			"layer": "default"
		}, json);
		let layer = this.maps[options.map].layers[options.layer];
		layer.setVisible(!layer.getVisible());
		this.finished(pid, self.queue.DEFINE.FIN_OK);

	}

	/**
	 * set layer on or off
	 * @param pid
	 * @param json
	 * @param {string} json.map - Map reference
	 * @param {string} json.layer - Layer to clear
	 * @param {string} json.active - active state to set
	 */
	setLayerActive(pid, json) {
		let options = Object.assign({
			"map": "default",
			"layer": "default",
			"active": true
		}, json);
		let layer = this.maps[options.map].layers[options.layer];
		layer.setVisible(options.active);
		this.finished(pid, self.queue.DEFINE.FIN_OK);

	}

	/**
	 *  Move the map so the cords are at the center
	 * @param pid
	 * @param json
	 * @param {string} json.map - Map reference
	 * @param {string} json.coordinate - Coordinate to use
	 * @example
	 * openlayers.centerOnCoordinate({"coordinate":"{{!^JSON.stringify(memory.simpleSelect.value.selected[0].getGeometry().getCoordinates())}}"});
	 *
	 */
	centerOnCoordinate(options) {
		let self = this;
		options = Object.assign({
			"map": "default",
		}, options);
		/*
		 * Pull all our resources
		 */
		let map = self.maps[options.map].object;
		let view = map.getView();

		if (!options.projection)
			options.projection = view.getProjection().getCode();
		let size = map.getSize();
		let cords = this.decodeCoords(options.coordinate, options.projection, view.getProjection().getCode());
		if (cords) {
			view.centerOn(cords, size, [size[0] / 2, size[1] / 2]);
		}
		if (options.zoom)
			view.setZoom(options.zoom);
		return true;

	}

	/**
	 * Clean up coordinates in any format and reproject
	 * @param cords
	 * @param projection
	 * @returns {number[]}
	 * @private
	 */
	decodeCoords(cords, projectionFrom, projectionTo) {
		projectionTo = projectionTo || "EPSG:4326";
		let returnCords = [];

		const srid = /^SRID=(.*?);POINT\((.*?)\)/;
		if (typeof cords === 'string') {
			const match = cords.match(srid);
			if (match) {
				try {
					returnCords = match[2].split(' ');
					returnCords = returnCords.map(function (str) {
						return parseFloat(str);
					})
					returnCords = transform(returnCords, "EPSG:" + match[1], projectionFrom);
					returnCords = this._cleanCoords(returnCords);
				} catch (e) {
					return false;
				}
			}

		} else {
			try {
				returnCords = transform(cords, projectionFrom, projectionTo);
				returnCords = this._cleanCoords(returnCords);
			} catch (e) {
				return false;
			}
		}

		return returnCords;
	}

	_cleanCoords(coords) {
		let returnCords = coords.map(function (str) {
			return parseFloat(str);
		})
		return returnCords;
	}

	/**
	 * Zoom a layer to the extent of its features (needs appropriate zoom levels to work well
	 * @param pid
	 * @param json
	 * @param {string} json.map - Map reference
	 * @param {string} json.inc - Increment of he zoom EG 1|-1|2|-2|etc
	 * @param {string} json.delay - Delay period of the zoom in ms
	 * @example
	 * openlayers.animateZoom({"inc":"2});
	 */
	animateZoom(options) {
		let self = this;
		options = Object.assign({
			"map": "default",
			"inc": +1,
			"delay": 100
		}, options);
		/*
		 * Pull all our resources
		 */
		let map = self.maps[options.map].object;
		let view = map.getView();
		/*
		 * Animate a zoom
		 */
		view.animate({zoom: view.getZoom() + options.inc, duration: options.delay});
		return true;
	}

	/**
	 * Zoom a layer to the extent of its features (needs appropriate zoom levels to work well
	 * @param pid
	 * @param json
	 * @param {string} json.map - Map reference
	 * @param {string} json.duration - Delay period of the zoom in ms
	 * @param {string} json.coordinate - location to fly to
	 * @param {boolean} json.wait - Wait till end of animation to finish queue item
	 * @example
	 * openlayers.flyTo({"location":"2});
	 */
	flyTo(options) {
		let self = this;
		options = Object.assign({
			"map": "default",
			"duration": 2000,
			"coordinate": "",
			"wait": false
		}, options);
		/*
		 * Pull all our resources
		 */
		let map = self.maps[options.map].object;
		let view = map.getView();

		let zoom = view.getZoom();
		let newZoom = options.zoom || zoom;
		let parts = 2;
		let called = false;

		function callback(complete) {
			--parts;
			if (called) {
				return;
			}
			if (parts === 0 || !complete) {
				called = true;
			}
		}

		view.animate({
			center: this.decodeCoords(options.coordinate, options.projection || view.getProjection().getCode(), view.getProjection().getCode()),
			duration: options.duration
		}, callback);
		view.animate({
			zoom: zoom - 1,
			duration: options.duration / 2
		}, {
			zoom: newZoom,
			duration: options.duration / 2
		});

	}

	setResolution(pid, json) {
		let self = this;
		let options = Object.assign({
			"map": "default"
		}, json);
		/*
		 * Pull all our resources
		 */
		let map = self.maps[options.map].object;
		let view = map.getView();
		view.setResolution(options.resolution);
		self.finished(pid, self.queue.DEFINE.FIN_OK);
	}

	/**
	 * Zoom a layer to the extent of its features (needs appropriate zoom levels to work well
	 * @param pid
	 * @param json
	 * @param {string} json.map - Map reference
	 * @param {string} json.layer - Layer to get extent from
	 * @example
	 * openlayers.zoomToLayerExtent({"map":"map_1","layer":"data"});
	 */
	zoomToLayersExtent(options) {
		let self = this;
		options = Object.assign({
			"map": "default",
			"layers": ["default"],
			"buffer": 100,
			"unit": "meters"
		}, options);
		/*
		 * Pull all our resources
		 */
		let map = self.maps[options.map].object;
		let view = map.getView();


		let featuresBbox;

		if (options.extent) {
			featuresBbox = options.extent;
		} else {
			let features=[];
			for (let l in options.layers) {
				let layer = self.maps[options.map].layers[options.layers[l]];
				let source = layer.getSource();
				/*
				 * Get the extent of the features and fit them
				 */


				features = [...features,...source.getFeatures()];



			}
			if (features.length > 0) {

				let featuresGeojson = new GeoJSON({
					"dataProjection": "EPSG:4326",
					"featureProjection": view.getProjection().getCode()
				}).writeFeaturesObject(features);

				featuresBbox = bbox(featuresGeojson);
			} else {
				console.log('No features to bbox');
				return false;
			}
		}

		let dist1 = featuresBbox[2] - featuresBbox[0];
		let dist2 = featuresBbox[3] - featuresBbox[1];
		let aDist = (((dist1 + dist2) / 2) * options.buffer) + 1;

		//console.log(`dists: ${dist1} - ${dist2} = ${aDist}`);

		let extentPolygon = bboxPolygon(featuresBbox);
		let bufferedFeature = buffer(extentPolygon, aDist, {units: options.unit});
		let bufferedExtent = bbox(bufferedFeature);
		let transformedExtentP1 = transform([bufferedExtent[0], bufferedExtent[1]], "EPSG:4326", view.getProjection().getCode());
		let transformedExtentP2 = transform([bufferedExtent[2], bufferedExtent[3]], "EPSG:4326", view.getProjection().getCode());
		let transformedExtent = [transformedExtentP1[0], transformedExtentP1[1], transformedExtentP2[0], transformedExtentP2[1]]
		try {
			view.fit(transformedExtent, map.getSize());
		} catch (e) {
			/*
			 * Fitting when the layer is empty fill cause OL to error
			 */
		}
	}


	/**
	 * Update size of map (in the event of resize or rotation this will fix it)
	 * @param pid
	 * @param json
	 * @param {string} json.map - Map reference can be * and all maps will be targeted
	 * @example
	 * openlayers.updateSize({"map":"map_1"});
	 */
	updateSize(options) {
		let self = this;
		options = Object.assign({
			"map": "default",
		}, options);
		/*
		 * Pull all our resources
		 */
		if (options.map === "*") {
			for (let i in self.maps) {
				let map = self.maps[i].object;
				map.updateSize();
			}
		} else {
			let map = self.maps[options.map].object;
			map.updateSize();
		}
	}


}
