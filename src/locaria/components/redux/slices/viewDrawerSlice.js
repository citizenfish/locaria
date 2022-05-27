import {createSlice} from '@reduxjs/toolkit'

export const viewDrawerSlice = createSlice({
	name: 'viewDraw',
	initialState: {
		open: false,
		category: false,
		fid: false,
		position: 0,
		more: false,
		report: null
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
		},
		setReport: (state, action) => {
			state.report=action.payload;
		}
	},
})

// Action creators are generated for each case reducer function
export const {openViewDraw, closeViewDraw,setPosition,setReport} = viewDrawerSlice.actions

export default viewDrawerSlice.reducer