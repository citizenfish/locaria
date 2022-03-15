import {createSlice} from '@reduxjs/toolkit'

export const viewDrawSlice = createSlice({
	name: 'viewDraw',
	initialState: {
		open: false,
		category: false,
		fid: false,
		position: 0
	},
	reducers: {
		openViewDraw: (state, action) => {
			state.open = true;
			state.fid = action.payload.fid;
			state.category = action.payload.category;
		},
		closeViewDraw: (state) => {
			state.open = false;
			state.fid = false;
		},
		moreResults: (state) => {

		}
	},
})

// Action creators are generated for each case reducer function
export const {openViewDraw, closeViewDraw,moreResults} = viewDrawSlice.actions

export default viewDrawSlice.reducer