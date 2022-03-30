import { createSlice } from '@reduxjs/toolkit'

export const typeAhead = createSlice({
	name: 'typeAhead',
	initialState: {
		open: false,
		results: []
	},
	reducers: {
		openTypeAhead: (state,action) => {
			state.open =true;
			state.results=action.payload;
		},
		closeTypeAhead: (state) => {
			state.open=false;
		}
	},
})

// Action creators are generated for each case reducer function
export const { openTypeAhead, closeTypeAhead } = typeAhead.actions

export default typeAhead.reducer