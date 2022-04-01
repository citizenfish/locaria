import React from 'react';

import { createSlice } from '@reduxjs/toolkit'


export const adminSlice = createSlice({
	name: 'adminSlice',
	initialState: {
		title: 'Upload',
		total: -1,

	},
	reducers: {
		setTitle: (state,action) => {
			state.title=action.payload;
		},
		setTotal: (state,action) => {
			state.total =action.payload;
		}
	},
})

// Action creators are generated for each case reducer function
export const { setTotal,setTitle } = adminSlice.actions

export default adminSlice.reducer