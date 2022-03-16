import {createSlice} from '@reduxjs/toolkit'

export const viewDrawSlice = createSlice({
	name: 'viewDraw',
	initialState: {
		open: false,
		category: false,
		fid: false,
		position: 0,
		more: false
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
		setPosition: (state,action) => {
			state.position=action.payload.position;
			state.more=action.payload.more;
		}
	},
})

// Action creators are generated for each case reducer function
export const {openViewDraw, closeViewDraw,setPosition} = viewDrawSlice.actions

export default viewDrawSlice.reducer