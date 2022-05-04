import React from 'react';

import { createSlice } from '@reduxjs/toolkit'


export const adminDashboardDrawerSlice = createSlice({
	name: 'adminDashboardDrawer',
	initialState: {
		open: false
	},
	reducers: {
		openDashboardDrawer: (state) => {
			state.open =true;
		},
		closeDashboardDrawer: (state) => {
			state.open =false;
		}
	}
});

// Action creators are generated for each case reducer function
export const { openDashboardDrawer,closeDashboardDrawer } = adminDashboardDrawerSlice.actions

export default adminDashboardDrawerSlice.reducer