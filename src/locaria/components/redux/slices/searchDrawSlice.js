import { createSlice } from '@reduxjs/toolkit'

export const searchDrawSlice = createSlice({
	name: 'searchDraw',
	initialState: {
		open: false
	},
	reducers: {
		openSearchDraw: (state) => {
			state.open =true;
		},
		closeSearchDraw: (state) => {
			state.open =false;
		},
		toggleSearchDraw: (state) => {
			state.open = !state.open;
		},
	},
})

// Action creators are generated for each case reducer function
export const { openSearchDraw, closeSearchDraw, toggleSearchDraw } = searchDrawSlice.actions

export default searchDrawSlice.reducer