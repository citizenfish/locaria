import {createSlice} from '@reduxjs/toolkit'

export const viewDrawSlice = createSlice({
	name: 'viewDraw',
	initialState: {
		open: false,
		fid: false
	},
	reducers: {
		openViewDraw: (state, action) => {
			state.open = true;
			state.fid = action.payload;
		},
		closeViewDraw: (state) => {
			state.open = false;
			state.fid = false;
		}
	},
})

// Action creators are generated for each case reducer function
export const {openViewDraw, closeViewDraw} = viewDrawSlice.actions

export default viewDrawSlice.reducer