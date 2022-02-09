import { createSlice } from '@reduxjs/toolkit'

export const menuDrawSlice = createSlice({
	name: 'menuDraw',
	initialState: {
		open: false
	},
	reducers: {
		openMenuDraw: (state) => {
			state.open =true;
		},
		closeMenuDraw: (state) => {
			state.open =false;
		}
	},
})

// Action creators are generated for each case reducer function
export const { openMenuDraw, closeMenuDraw } = menuDrawSlice.actions

export default menuDrawSlice.reducer