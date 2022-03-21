import { createSlice } from '@reduxjs/toolkit'

export const pageDialog = createSlice({
	name: 'pageDialog',
	initialState: {
		open: false,
		page: false
	},
	reducers: {
		openPageDialog: (state,action) => {
			state.open =true;
			state.page=action.payload;
		},
		closePageDialog: (state) => {
			state.open=false;
		}
	},
})

// Action creators are generated for each case reducer function
export const { openPageDialog, closePageDialog } = pageDialog.actions

export default pageDialog.reducer