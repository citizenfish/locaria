import React from 'react';

import { createSlice } from '@reduxjs/toolkit'


export const adminEditDrawerSlice = createSlice({
	name: 'adminEditDrawer',
	initialState: {
		open: false,

	},
	reducers: {
		openEditDrawer: (state) => {
			state.open =true;
		},
		closeEditDrawer: (state) => {
			state.open =false;
		}
	},
})

// Action creators are generated for each case reducer function
export const { openEditDrawer,closeEditDrawer } = adminEditDrawerSlice.actions

export default adminEditDrawerSlice.reducer