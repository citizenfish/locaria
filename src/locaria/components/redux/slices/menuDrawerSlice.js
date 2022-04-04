import { createSlice } from '@reduxjs/toolkit'

export const menuDrawerSlice = createSlice({
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
export const { openMenuDraw, closeMenuDraw } = menuDrawerSlice.actions

export default menuDrawerSlice.reducer