import {createSlice} from '@reduxjs/toolkit'

export const layoutSlice = createSlice({
	name: 'layout',
	initialState: {
		open: false,
		homeLocation: false,
		resolutions: undefined,
		route: false
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
		},
		newRoute: (state) => {
			state.route=true;
		},
		routeUpdated: (state) => {
			state.route=false;
		}
	},
})

// Action creators are generated for each case reducer function
export const {openLayout, closeLayout,setLocation,setResolutions,newRoute,routeUpdated} = layoutSlice.actions

export default layoutSlice.reducer