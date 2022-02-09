import { createSlice } from '@reduxjs/toolkit'

export const categoryDrawSlice = createSlice({
	name: 'categoryDraw',
	initialState: {
		open: false
	},
	reducers: {
		openCategoryDraw: (state) => {
			state.open =true;
		},
		closeCategoryDraw: (state) => {
			state.open =false;
		},
		toggleCategoryDraw: (state) => {
			state.open = !state.open;

		},
	},
})

// Action creators are generated for each case reducer function
export const { openCategoryDraw, closeCategoryDraw, toggleCategoryDraw } = categoryDrawSlice.actions

export default categoryDrawSlice.reducer