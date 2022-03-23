import {createSlice} from '@reduxjs/toolkit'

export const layoutSlice = createSlice({
	name: 'layout',
	initialState: {
		open: false,
		homeLocation: false,
		resolutions: undefined
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
		},
		setResolutions: (state,action) => {
			state.resolutions=action.payload;
		}
	},
})

// Action creators are generated for each case reducer function
export const {openLayout, closeLayout,setLocation,setResolutions} = layoutSlice.actions

export default layoutSlice.reducer