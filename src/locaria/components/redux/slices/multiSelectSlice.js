import {createSlice} from '@reduxjs/toolkit'

export const multiSelectSlice = createSlice({
	name: 'multiSelect',
	initialState: {
		open: false,
		features: []
	},
	reducers: {
		openMultiSelect: (state, action) => {
			state.open = true;
			state.features = action.payload;
		},
		closeMultiSelect: (state) => {
			state.open = false;
			state.fid = false;
		}
	},
})

// Action creators are generated for each case reducer function
export const {openMultiSelect, closeMultiSelect} = multiSelectSlice.actions

export default multiSelectSlice.reducer