import React from 'react';

import { createSlice } from '@reduxjs/toolkit'


export const adminUploadDrawerSlice = createSlice({
	name: 'adminUploadDrawer',
	initialState: {
		open: true,

	},
	reducers: {
		openUploadDrawer: (state) => {
			state.open =true;
		},
		closeUploadDrawer: (state) => {
			state.open =false;
		}
	},
})

// Action creators are generated for each case reducer function
export const { openUploadDrawer,closeUploadDrawer } = adminUploadDrawerSlice.actions

export default adminUploadDrawerSlice.reducer