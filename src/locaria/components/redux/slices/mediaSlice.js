import { createSlice } from '@reduxjs/toolkit'

export const mediaSlice = createSlice({
	name: 'mediaSlice',
	initialState: {
		mobile: false,
		innerWidth: 0
	},
	reducers: {
		setMobile: (state,action) => {
			state.mobile=action.payload;
			state.innerWidth=window.innerWidth;
			state.innerHeight=window.innerHeight;
		}
	},
})

// Action creators are generated for each case reducer function
export const { setMobile } = mediaSlice.actions

export default mediaSlice.reducer