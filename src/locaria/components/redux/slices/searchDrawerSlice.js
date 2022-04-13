import {createSlice} from '@reduxjs/toolkit'

export const searchDrawerSlice = createSlice({
	name: 'searchDraw',
	initialState: {
		open: false,
		categories: [],
		search: '',
		locationShow: false,
		distance: 0,
		tags: [],
		resolutionUpdate: false,
		tagList: [],
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
		toggleLocationShow: (state) => {
			state.locationShow = !state.locationShow;
		},
		setDistance: (state,action) => {
			state.distance = action.payload;
			state.page=1;
			state.totalPages=0;
		},
		setTags: (state, action) => {
			state.tags = action.payload;
			state.page=1;
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
			if(state.tags.indexOf(action.payload) === -1)
				state.tags.push(action.payload);
			state.page=1;
			state.totalPages=0;
		},
		setTagList: (state,action) => {
			state.tagList=action.payload;
		},
		setPage: (state,action)=> {
			state.page=action.payload;
		},
		setTotalPages: (state,action)=> {
			state.totalPages=parseInt(action.payload);
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
	setTotalPages
} = searchDrawerSlice.actions

export default searchDrawerSlice.reducer