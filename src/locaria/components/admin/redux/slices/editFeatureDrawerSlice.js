import React from 'react';

import { createSlice } from '@reduxjs/toolkit'


export const adminEditFeatureDrawerSlice = createSlice({
	name: 'adminEditFeatureDrawer',
	initialState: {
		open: false,
		feature: null,
		data: null
	},
	reducers: {
		openEditFeatureDrawer: (state,action) => {
			state.open =true;
			state.feature=action.payload;
		},
		closeEditFeatureDrawer: (state) => {
			state.open =false;
		},
		setEditFeatureData:(state,action) => {
			state.data=action.payload;
		},
		updateEditFeatureData:(state,action) => {
			try {
				eval(`state.data.features[0].properties.${action.payload.path} = action.payload.value`);
			} catch (e) {
				console.log(e);
			}
		}
	},
})

// Action creators are generated for each case reducer function
export const { openEditFeatureDrawer,closeEditFeatureDrawer,setEditFeatureData,updateEditFeatureData } = adminEditFeatureDrawerSlice.actions

export default adminEditFeatureDrawerSlice.reducer