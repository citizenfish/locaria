import React from 'react';

import {createSlice} from '@reduxjs/toolkit'
import {delObjectWithPath, objectPathExists, setObjectWithPath} from "libs/objectTools";

export const searchDrawerSlice = createSlice({
	name: 'searchDraw',
	initialState: {
		// The search payload, change this and search triggers
		searchParams:{
			subCategories: {"subCategory1":[],"subCategory2":[]},
			location: undefined,
			limit: 10000,
			displayLimit: undefined,
			categories: [],
			search: '',
			distance: 0,
			page: 1,
			filters:{},
			bbox:[],
			distanceType: 'km',
			fids:[],
			sendRecommended: false

		},

		categoryChosen: undefined,

		wait: false,

		resultBbox: undefined,

		// HARD CODE WARNING TODO This needs to be built by the filters
		schema: [
			{
				"type":"filter",
				"path":"data.free"
			},
			{
				"type":"jsonpath",
				"path":"data.days",
				"logic":"||"
			},
			{
				"type":"jsonpath",
				"path":"data.subCategory1",
				"logic":"||",
				"unique":true
			},
			{
				"type":"jsonpath",
				"path":"data.subCategory2",
				"logic":"||",
				"unique":true

			}
		],

		refreshCounts: true,

		// Counts of possible results

		counts:{},

		loading: false,
		ready: false,

		locationShow: false,
		tags: [],
		resolutionUpdate: false,
		tagList: [],

		totalPages: 0,

		features: {},
		feature:undefined,
		fid: undefined,


		locationOpen: false,
		questionsOpen: false,
		locationPage: undefined,
		geolocation: undefined,
		currentLocation: undefined,
		askQuestions: 0,
		rewrite: true
	},
	reducers: {
		setQuestionsOpen: (state, action) => {
			state.questionsOpen = action.payload;
			state.askQuestions=0;
		},
		setCategoryChosen: (state, action) => {
			state.categoryChosen = action.payload;
		},
		clearCategoryChosen: (state) => {
			state.categoryChosen = undefined;
		},
		setAskQuestions:(state,actions) => {
			state.askQuestions = actions.payload;
		},
		setResultBbox:(state,actions) => {
			if(actions.payload&&typeof actions.payload === 'string') {
				//Convert string EG BOX(-199488.83556583992 6719078.999316478,-198111.19452835835 6721045.020766511)  into actions.payload into an array
				const arr = actions.payload.replace(/BOX\(/, '').replace(/\)/g, '').split(/[ ,]+/);
				state.resultBbox = arr.map((item) => Number(item));
			}
		},
		setRefreshCounts:(state,action) => {
			state.refreshCounts=action.payload;
		},
		setCounts:(state,action) => {
			state.counts=action.payload;
			if(state.searchParams.tags) {
				if(state.counts&&state.counts.tags&&typeof state.counts.tags === 'object') {
					for (let t in state.searchParams.tags) {
						if (!objectPathExists(state.counts.tags,state.searchParams.tags[t])) {
							state.searchParams.tags.splice(state.searchParams.tags.indexOf(state.searchParams.tags[t]), 1);
						}
					}
				} else {
					state.searchParams.tags=[];
				}
			}
			let subs=["subCategory1","subCategory2"];
			for(let s in subs) {
				if (state.searchParams.subCategories[subs[s]]) {
					if (state.counts && state.counts[subs[s]] && typeof state.counts[subs[s]] === 'object') {
						for (let t in state.searchParams.subCategories[subs[s]]) {
							if (!objectPathExists(state.counts[subs[s]],state.searchParams.subCategories[subs[s]][t])) {
								state.searchParams.subCategories[subs[s]].splice(state.searchParams.subCategories[subs[s]].indexOf(state.searchParams.subCategories[subs[s]][t]), 1);
							}
						}
					} else {
						state.searchParams.subCategories[subs[s]] = [];
					}
				}
			}
		},

		setFeatures: (state,action) => {
			state.features=action.payload;
		},
		setFeature: (state, action) => {
			for(let f in state.features.features) {
				if(state.features.features[f].properties.fid===action.payload) {
					state.feature=state.features.features[f];
					return;
				}
			}
			console.log(`Cant find ${action.payload}`);
		},


		newSearch: (state, action) => {

			if(action.payload.page)
				state.searchParams.page=action.payload.page;
			else
				state.searchParams.page=1;
			state.totalPages=0;


			if (action.payload && action.payload.categories){
				state.searchParams.categories = action.payload.categories;
				state.searchParams.tags = []; //If category changes then so must tags
			}

			if(action.payload && action.payload.tags) {
				state.searchParams.tags=action.payload.tags;
			}

			if(action.payload && action.payload.filters) {
				state.searchParams.filters=action.payload.filters;
			} else {
				state.searchParams.filters={};
			}

			if(action.payload && action.payload.distance) {
				state.searchParams.distance=action.payload.distance;
			}

			if (action.payload && action.payload.search){
				state.searchParams.search = action.payload.search;
			} else {
				state.searchParams.search = "";
			}

			if (action.payload && action.payload.limit){
				state.searchParams.limit = action.payload.limit;
			} else {
				state.searchParams.limit= undefined;
			}
			if (action.payload && action.payload.displayLimit){
				state.searchParams.displayLimit = action.payload.displayLimit;
			} else {
				state.searchParams.displayLimit=undefined;
			}

			// Location set

			if (action.payload && action.payload.location){
				state.searchParams.location = action.payload.location;
			} else {
				state.searchParams.location= undefined;
			}

			if(action.payload && action.payload.bbox&&Array.isArray(action.payload.bbox)&&action.payload.bbox.length===4) {
				state.searchParams.bbox = action.payload.bbox;
			} else {
				state.searchParams.bbox=[];
			}

			if (action.payload && action.payload.subCategories){
				state.searchParams.subCategories = action.payload.subCategories;
			} else {
				state.searchParams.subCategories= {};
			}

			if (action.payload && action.payload.fids){
				state.searchParams.fids = action.payload.fids;
			} else {
				state.searchParams.fids=[];
			}

			if(action.payload.rewrite!==undefined) {
				state.rewrite=action.payload.rewrite;
			}

			if(action.payload && action.payload.sendRecommended) {
				state.searchParams.sendRecommended=action.payload.sendRecommended;
			} else {
				state.searchParams.sendRecommended=false;
			}
			state.refreshCounts=true;
			state.ready=true;
			if(action.payload.wait)
				state.wait=action.payload;
		},

		clearWait:(state) => {
			state.wait=false;
		},


		deleteSearchCategory: (state, action) => {
			if (state.categories.indexOf(action.payload) !== -1) {
				state.categories.splice(state.categories.indexOf(action.payload), 1);
				state.tags = []; //If category changes then so must tags
			}
		},
		clearSearchCategory: (state) => {
			state.searchParams.categories = [];
			state.searchParams.tags = [];
			state.searchParams.page=1;
			state.totalPages=0;

		},
		setRecommended: (state,action) => {
			state.searchParams.sendRecommended = action.payload;
			state.searchParams.page=1;
			state.totalPages=0;

		},
		setSearch: (state,action) => {
			state.searchParams.search = action.payload.search;
			state.searchParams.page=1;
			state.totalPages=0;

		},
		setCategoryList : (state, action) => {
			if (action.payload) {
				state.categories = action.payload
			}
		},


		toggleLocationShow: (state) => {
			state.locationShow = !state.locationShow;
		},

		setDistance: (state,action) => {
			state.refreshCounts=true;
			state.searchParams.distance = action.payload;
			state.searchParams.page=1;
			state.totalPages=0;

		},
		setDistanceType: (state,action) => {
			state.refreshCounts=true;
			state.searchParams.distanceType = action.payload;
			state.searchParams.page=1;
			state.totalPages=0;
		},
		setLocation: (state,action) => {
			state.searchParams.location = action.payload;
			state.searchParams.page=1;
			state.totalPages=0;
		},

		setTags: (state, action) => {
			state.searchParams.tags = action.payload;
			// Hardcoded hax TODO this needs to be config
			state.searchParams.subCategories["subCategory1"]=[];
			state.searchParams.subCategories["subCategory2"]=[];
			state.searchParams.page=1;
			state.totalPages=0;

		},
		setSubCategory: (state, action) => {
			state.searchParams.subCategories[action.payload.sub]=action.payload.data;
			// Hardcoded hax TODO this needs to be config
			state.searchParams.tags=[];
			state.searchParams.page=1;
			state.totalPages=0;

		},
		deleteTag: (state,action) => {
			state.tags.splice(state.tags.indexOf(action.payload),1);
			state.searchParams.page=1;
			state.searchParams.totalPages=0;

		},
		resetTags: (state) => {
			state.searchParams.tags = [];
			state.searchParams.page=1;
			state.totalPages=0;

		},
		addTag: (state,action) => {
			if(Array.isArray(action.payload)) {
				state.tags=action.payload;
			} else {
				if (state.tags.indexOf(action.payload) === -1)
					state.tags.push(action.payload);
			}
			state.searchParams.page=1;
			state.totalPages=0;

		},
		setTagList: (state,action) => {
			state.tagList=action.payload;
		},
		setPage: (state,action)=> {
			state.searchParams.page=action.payload;

		},
		setTotalPages: (state,action)=> {
			state.totalPages=parseInt(action.payload);
		},
		locationPopup: (state,action) => {
			state.locationOpen=action.payload.open;
			state.locationPage=action.payload.page;

		},
		setGeolocation: (state,action) => {
			state.geolocation=action.payload;
		},
		setCurrentLocation: (state,action) => {
			state.currentLocation=action.payload;
		},
		startLoading: (state) => {
			state.loading=true;
		},
		stopLoading: (state) => {
			state.loading=false;
		},
		setDisplayLimit: (state,action)=> {
			state.searchParams.displayLimit=action.payload;
			state.loading=false;
		},
		setFilterItem: (state,action) => {

			setObjectWithPath(state.searchParams.filters,action.payload.path,action.payload.value);
			// Browser can't cope well displaying proxy, use current to debug
			//console.log(current(state));

			state.searchParams.page=1;
			state.totalPages=0;
		},
		clearFilterItem: (state,action) => {
			delObjectWithPath(state.searchParams.filters,action.payload.path);
			state.page=1;
			state.totalPages=0;
		},
		setBbox: (state, action) => {
			//debugger;
			state.refreshCounts=true;
			state.searchParams.bbox=action.payload;
			state.page=1;
			state.totalPages=0;
			state.searchParams.limit=1000;
			state.searchParams.displayLimit=1000;
		}

	},
})

// Action creators are generated for each case reducer function
export const {
	deleteSearchCategory,
	clearSearchCategory,
	setSearch,
	toggleLocationShow,
	setDistance,
	setTags,
	setCategoryList,
	deleteTag,
	addTag,
	resetTags,
	setTagList,
	setPage,
	setTotalPages,
	setDistanceType,
	newSearch,
	setFeatures,
	setFeature,
	locationPopup,
	setGeolocation,
	setLocation,
	setSubCategory,
	startLoading,
	stopLoading,
	setDisplayLimit,
	setCounts,
	setRefreshCounts,
	setCurrentLocation,
	setFilterItem,
	clearFilterItem,
	setBbox,
	clearWait,
	setResultBbox,
	setAskQuestions,
	setCategoryChosen,
	clearCategoryChosen,
	setRecommended,
	setQuestionsOpen

} = searchDrawerSlice.actions

export default searchDrawerSlice.reducer