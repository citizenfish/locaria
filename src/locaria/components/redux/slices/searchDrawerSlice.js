import React from 'react';

import {createSlice} from '@reduxjs/toolkit'

export const searchDrawerSlice = createSlice({
	name: 'searchDraw',
	initialState: {
		open: false,
		categories: [],
		subCategories:[],
		search: '',
		locationShow: false,
		distance: 0,
		distanceType: 'km',
		tags: [],
		resolutionUpdate: false,
		tagList: [],
		refresh: false,
		page: 1,
		totalPages: 0,
		features: {},
		feature:undefined,
		fid: undefined,
		limit: undefined,
		displayLimit: undefined,
		locationOpen: false,
		locationPage: undefined,
		geolocation: undefined,
		location: undefined,
	},
	reducers: {
		/// OLD kill when search draw is gone
		openSearchDrawer: (state, action) => {
			state.open = true;
			state.page=1;
			state.totalPages=0;
			if (action.payload && action.payload.categories){
				if(action.payload.mode==='add') {
					for(let c in action.payload.categories) {
						if(state.categories.indexOf(action.payload.categories[c])===-1)
							state.categories.push(action.payload.categories[c]);
						else
							state.categories.splice(state.categories.indexOf(action.payload.categories[c]),1);
					}
				}
				else
					state.categories = action.payload.categories;
				state.tags = []; //If category changes then so must tags
			}

			if(action.payload && action.payload.distance) {
				state.distance=action.payload.distance;
			}

			if (action.payload && action.payload.search){
				state.search = action.payload.search;
			}
			if (action.payload && action.payload.subCategories){
				state.subCategories = action.payload.subCategories;
			}
			state.refresh=true;

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
			state.open = true;
			state.page=1;
			state.totalPages=0;
			if (action.payload && action.payload.categories){
				if(action.payload.mode==='add') {
					for(let c in action.payload.categories) {
						if(state.categories.indexOf(action.payload.categories[c])===-1)
							state.categories.push(action.payload.categories[c]);
						else
							state.categories.splice(state.categories.indexOf(action.payload.categories[c]),1);
					}
				}
				else
					state.categories = action.payload.categories;
				state.tags = []; //If category changes then so must tags
			}

			if(action.payload && action.payload.tags) {
				state.tags=action.payload.tags;
			}



			if(action.payload && action.payload.distance) {
				state.distance=action.payload.distance;
			}

			if (action.payload && action.payload.search){
				state.search = action.payload.search;
			}
			if (action.payload && action.payload.limit){
				state.limit = action.payload.limit;
			} else {
				state.limit= undefined;
			}
			if (action.payload && action.payload.displayLimit){
				state.displayLimit = action.payload.displayLimit;
			} else {
				state.displayLimit=undefined;
			}

			state.refresh=true;
		},
		closeSearchDrawer: (state) => {
			state.open = false;
		},
		toggleSearchDrawer: (state) => {
			state.open = !state.open;
		},
		deleteSearchCategory: (state, action) => {
			if (state.categories.indexOf(action.payload) !== -1) {
				state.categories.splice(state.categories.indexOf(action.payload), 1);
				state.tags = []; //If category changes then so must tags
			}
			state.refresh=true;
		},
		clearSearchCategory: (state) => {
			state.categories = [];
			state.tags = [];
			state.page=1;
			state.totalPages=0;
			state.refresh=true;

		},
		setSearch: (state,action) => {
			state.search = action.payload.search;
			state.page=1;
			state.totalPages=0;
			if(action.payload.refresh)
				state.refresh=action.payload.refresh;
			else
				state.refresh=true;

		},
		setCategoryList : (state, action) => {
			if (action.payload) {
				state.categories = action.payload
			}
			state.refresh=true;
		},
		setSubCategoryList : (state, action) => {
			if (action.payload) {
				state.subCategories = action.payload
			}
			state.refresh=true;
		},
		toggleSubCategoryItem : (state,action) => {
			if(state.subCategories.indexOf(action.payload)!==-1) {
				state.subCategories.splice(state.subCategories.indexOf(action.payload),1);
			} else {
				state.subCategories.push(action.payload);
			}
			state.refresh=true;

		},
		toggleLocationShow: (state) => {
			state.locationShow = !state.locationShow;
		},
		setDistance: (state,action) => {
			state.distance = action.payload;
			state.page=1;
			state.totalPages=0;
			state.refresh=true;

		},
		setDistanceType: (state,action) => {
			state.distanceType = action.payload;
			state.refresh=true;
		},
		setLocation: (state,action) => {
			state.location = action.payload;
			state.refresh=true;
		},

		setTags: (state, action) => {
			state.tags = action.payload;
			state.page=1;
			state.totalPages=0;
			state.refresh=true;

		},
		deleteTag: (state,action) => {
			state.tags.splice(state.tags.indexOf(action.payload),1);
			state.page=1;
			state.totalPages=0;
			state.refresh=true;

		},
		resetTags: (state,action) => {
			state.tags = [];
			state.page=1;
			state.totalPages=0;
			state.refresh=true;

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
			state.refresh=true;

		},
		setTagList: (state,action) => {
			state.tagList=action.payload;
		},
		setPage: (state,action)=> {
			state.page=action.payload;
			state.refresh=true;

		},
		setTotalPages: (state,action)=> {
			state.totalPages=parseInt(action.payload);
		},
		clearRefresh: (state) => {
			state.refresh=false;
		},
		locationPopup: (state,action) => {
			state.locationOpen=action.payload.open;
			state.locationPage=action.payload.page;

		},
		setGeolocation: (state,action) => {
			state.geolocation=action.payload;
		}

	},
})

// Action creators are generated for each case reducer function
export const {
	openSearchDrawer,
	closeSearchDrawer,
	toggleSearchDrawer,
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
	clearRefresh,
	setDistanceType,
	newSearch,
	setFeatures,
	setFeature,
	setSubCategoryList,
	toggleSubCategoryItem,
	locationPopup,
	setGeolocation,
	setLocation
} = searchDrawerSlice.actions

export default searchDrawerSlice.reducer