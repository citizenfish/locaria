import {createSlice} from '@reduxjs/toolkit'

export const layoutSlice = createSlice({
	name: 'layout',
	initialState: {
		open: true,
		homeLocation: false
	},
	reducers: {
		openLayout: (state) => {
			state.open = true;
		},
		closeLayout: (state) => {
			state.open = false;
		},
		setLocation: (state, action) => {
			state.homeLocation=action.payload;
		}
	},
})

// Action creators are generated for each case reducer function
export const {openLayout, closeLayout,setLocation} = layoutSlice.actions

export default layoutSlice.reducer