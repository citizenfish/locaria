import { createSlice } from '@reduxjs/toolkit'

export const homeDrawerSlice = createSlice({
	name: 'homeDrawer',
	initialState: {
		open: false
	},
	reducers: {
		openHomeDrawer: (state) => {
			state.open =true;
		},
		closeHomeDrawer: (state) => {
			state.open =false;
		}
	},
})

// Action creators are generated for each case reducer function
export const { openHomeDrawer, closeHomeDrawer } = homeDrawerSlice.actions

export default homeDrawerSlice.reducer