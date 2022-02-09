import { createSlice } from '@reduxjs/toolkit'

export const searchDrawSlice = createSlice({
	name: 'searchDraw',
	initialState: {
		open: false,
		categories: []
	},
	reducers: {
		openSearchDraw: (state,action) => {
			state.open =true;
			if(action.payload&&action.payload.categories)
				state.categories=action.payload.categories;
		},
		closeSearchDraw: (state) => {
			state.open =false;
		},
		toggleSearchDraw: (state) => {
			state.open = !state.open;
		},
		deleteSearchCategory: (state,action) => {
			if(state.categories.indexOf(action.payload)!==-1)
			state.categories.splice(state.categories.indexOf(action.payload),1);
		}
	},
})

// Action creators are generated for each case reducer function
export const { openSearchDraw, closeSearchDraw, toggleSearchDraw,deleteSearchCategory } = searchDrawSlice.actions

export default searchDrawSlice.reducer