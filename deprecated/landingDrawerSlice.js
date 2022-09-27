import { createSlice } from '@reduxjs/toolkit'

export const landingDrawerSlice = createSlice({
	name: 'landingDraw',
	initialState: {
		open: false
	},
	reducers: {
		openLandingDraw: (state) => {
			state.open =true;
		},
		closeLandingDraw: (state) => {
			state.open =false;
		}
	},
})

// Action creators are generated for each case reducer function
export const { openLandingDraw, closeLandingDraw } = landingDrawerSlice.actions

export default landingDrawerSlice.reducer