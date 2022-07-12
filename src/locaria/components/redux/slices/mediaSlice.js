import { createSlice } from '@reduxjs/toolkit'

export const mediaSlice = createSlice({
	name: 'mediaSlice',
	initialState: {
		mobile: false
	},
	reducers: {
		setMobile: (state,action) => {
			state.mobile=action.payload;
		}
	},
})

// Action creators are generated for each case reducer function
export const { setMobile } = mediaSlice.actions

export default mediaSlice.reducer