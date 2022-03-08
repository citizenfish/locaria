import {createSlice} from '@reduxjs/toolkit'

export const searchDrawSlice = createSlice({
	name: 'searchDraw',
	initialState: {
		open: false,
		categories: [],
		search: '',
		locationShow: false
	},
	reducers: {
		openSearchDraw: (state, action) => {
			state.open = true;
			if (action.payload && action.payload.categories)
				state.categories = action.payload.categories;
			if (action.payload && action.payload.search)
				state.search = action.payload.search;
		},
		closeSearchDraw: (state) => {
			state.open = false;
		},
		toggleSearchDraw: (state) => {
			state.open = !state.open;
		},
		deleteSearchCategory: (state, action) => {
			if (state.categories.indexOf(action.payload) !== -1)
				state.categories.splice(state.categories.indexOf(action.payload), 1);
		},
		clearSearchCategory: (state) => {
			state.categories = [];
		},
		setSearch: (state,action) => {
			state.search=action.payload.search;
		},
		toggleLocationShow: (state) => {
			state.locationShow=!state.locationShow;
		}
	},
})

// Action creators are generated for each case reducer function
export const {
	openSearchDraw,
	closeSearchDraw,
	toggleSearchDraw,
	deleteSearchCategory,
	clearSearchCategory,
	setSearch,
	toggleLocationShow
} = searchDrawSlice.actions

export default searchDrawSlice.reducer