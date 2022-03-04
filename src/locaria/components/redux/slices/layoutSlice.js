import {createSlice} from '@reduxjs/toolkit'

export const layoutSlice = createSlice({
	name: 'layout',
	initialState: {
		open: true
	},
	reducers: {
		openLayout: (state) => {
			state.open = true;
		},
		closeLayout: (state) => {
			state.open = false;
		}
	},
})

// Action creators are generated for each case reducer function
export const {openLayout, closeLayout} = layoutSlice.actions

export default layoutSlice.reducer