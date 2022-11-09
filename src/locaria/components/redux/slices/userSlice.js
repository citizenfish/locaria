import React from 'react';

import {createSlice} from '@reduxjs/toolkit'

export const userSlice = createSlice({
	name: 'userSlice',
	initialState: {
		userValid:false,
		groups:[],
		id:undefined
	},
	reducers: {
		setValidUser: (state, action) => {
			state.userValid = true;
			state.groups = action.payload.groups;
			state.id = action.payload.id;
		},
		setValidPublic: (state, action) => {
			state.userValid = false;
			state.groups = [];
			state.id = undefined;
		},

	}
});

export const {
	setValidUser,
	setValidPublic
} = userSlice.actions

export default userSlice.reducer