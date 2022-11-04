import React from 'react';

import {createSlice} from '@reduxjs/toolkit'

export const searchDrawerSlice = createSlice({
	name: 'searchDraw',
	initialState: {
		// The search payload, change this and search triggers
		searchParams:{
			subCategories: {"subCategory1":[],"subCategory2":[]},
			location: undefined,
			limit: undefined,
			displayLimit: undefined,
			categories: [],
			search: '',
			distance: 0,
			page: 1,

		},



		loading: false,
		ready: false,

		locationShow: false,
		distanceType: 'km',
		tags: [],
		resolutionUpdate: false,
		tagList: [],

		totalPages: 0,

		features: {},
		feature:undefined,
		fid: undefined,


		locationOpen: false,
		locationPage: undefined,
		geolocation: undefined,

		rewrite: true
	},
	reducers: {

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



			if(action.payload && action.payload.distance) {
				state.searchParams.distance=action.payload.distance;
			}

			if (action.payload && action.payload.search){
				state.searchParams.search = action.payload.search;
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

			if (action.payload && action.payload.location){
				state.searchParams.location = action.payload.location;
			} else {
				state.searchParams.location= undefined;
			}

			if (action.payload && action.payload.subCategories){
				state.searchParams.subCategories = action.payload.subCategories;
			} else {
				state.searchParams.subCategories= {};
			}

			if(action.payload.rewrite!==undefined) {
				state.rewrite=action.payload.rewrite;
			}
			state.ready=true;
		},


		deleteSearchCategory: (state, action) => {
			if (state.categories.indexOf(action.payload) !== -1) {
				state.categories.splice(state.categories.indexOf(action.payload), 1);
				state.tags = []; //If category changes then so must tags
			}
		},
		clearSearchCategory: (state) => {
			state.categories = [];
			state.tags = [];
			state.page=1;
			state.totalPages=0;

		},
		setSearch: (state,action) => {
			state.search = action.payload.search;
			state.page=1;
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
			state.searchParams.distance = action.payload;
			state.page=1;
			state.totalPages=0;
		},
		setDistanceType: (state,action) => {
			state.distanceType = action.payload;
		},
		setLocation: (state,action) => {
			state.location = action.payload;
		},

		setTags: (state, action) => {
			state.searchParams.tags = action.payload;
			state.page=1;
			state.totalPages=0;

		},
		setSubCategory: (state, action) => {
			state.searchParams.subCategories[action.payload.sub]=action.payload.data;
			state.searchParams.page=1;
			state.totalPages=0;

		},
		deleteTag: (state,action) => {
			state.tags.splice(state.tags.indexOf(action.payload),1);
			state.page=1;
			state.totalPages=0;

		},
		resetTags: (state,action) => {
			state.tags = [];
			state.page=1;
			state.totalPages=0;

		},
		addTag: (state,action) => {
			if(Array.isArray(action.payload)) {
				state.tags=action.payload;
			} else {
				if (state.tags.indexOf(action.payload) === -1)
					state.tags.push(action.payload);
			}
			state.page=1;
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
		startLoading: (state,action) => {
			state.loading=true;
		},
		stopLoading: (state,action) => {
			state.loading=false;
		},
		setDisplayLimit: (state,action)=> {
			state.searchParams.displayLimit=action.payload;
			state.loading=false;
		},


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
	setDisplayLimit

} = searchDrawerSlice.actions

export default searchDrawerSlice.reducer