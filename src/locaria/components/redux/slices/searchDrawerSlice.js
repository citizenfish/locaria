import {createSlice} from '@reduxjs/toolkit'

export const searchDrawerSlice = createSlice({
	name: 'searchDraw',
	initialState: {
		open: false,
		categories: [],
		search: '',
		locationShow: false,
		distance: 0,
		distanceType: 'km',
		tags: [],
		resolutionUpdate: false,
		tagList: [],
		refresh: false,
		page: 1,
		totalPages: 0
	},
	reducers: {
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
	deleteTag,
	addTag,
	resetTags,
	setTagList,
	setPage,
	setTotalPages,
	clearRefresh,
	setDistanceType
} = searchDrawerSlice.actions

export default searchDrawerSlice.reducer