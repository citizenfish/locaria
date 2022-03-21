import { createSlice } from '@reduxjs/toolkit'

export const landingDrawSlice = createSlice({
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
export const { openLandingDraw, closeLandingDraw } = landingDrawSlice.actions

export default landingDrawSlice.reducer