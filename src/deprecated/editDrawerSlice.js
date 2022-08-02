import React from 'react';

import { createSlice } from '@reduxjs/toolkit'


export const adminEditDrawerSlice = createSlice({
	name: 'adminEditDrawer',
	initialState: {
		open: false,
		data: []
	},
	reducers: {
		openEditDrawer: (state) => {
			state.open =true;
		},
		closeEditDrawer: (state) => {
			state.open =false;
		},
		setEditData: (state,action) => {
			state.data=action.payload;
		}
	},
})

// Action creators are generated for each case reducer function
export const { openEditDrawer,closeEditDrawer,setEditData } = adminEditDrawerSlice.actions

export default adminEditDrawerSlice.reducer