import React from 'react';

import {createSlice} from '@reduxjs/toolkit'

export const userSlice = createSlice({
	name: 'userSlice',
	initialState: {
		userValid:false,
		groups:[],
		id:undefined,
		// Saved State Items to local storage
		localDefs: {
			"question1":"",
			question2:[],
			gotoCategory:"",
			askQuestions:0,
			recentLocations:[],
			currentLocation:undefined,
			lastPage:"",
			basket:[],
			idToken: undefined,
		},
		// storage
		question1:undefined,
		question2:undefined,
		gotoCategory:undefined,
		askQuestions:undefined,
		recentLocations:undefined,
		currentLocation:undefined,
		lastPage:undefined,
		basket:undefined,
		// secure stuff
		idToken:undefined,
	},
	reducers: {
		reloadProfile(state){
			// Reloads all settings from local storage

			function getLocalWithSafeDecode(attribute) {

				// default the return
				let decodedReturn=state.localDefs[attribute];
				try {
					decodedReturn=JSON.parse(localStorage.getItem(attribute));
					if(decodedReturn===null){
						decodedReturn=state.localDefs[attribute];
					}
				} catch (e) {
					console.log("Error decoding local storage item "+attribute);
				}
				return decodedReturn;
			}

			state.question1=getLocalWithSafeDecode("question1");
			state.question2=getLocalWithSafeDecode("question2");
			state.gotoCategory=getLocalWithSafeDecode("gotoCategory");
			state.askQuestions=getLocalWithSafeDecode("askQuestions");
			state.recentLocations=getLocalWithSafeDecode("recentLocations");
			state.currentLocation=getLocalWithSafeDecode("currentLocation");
			state.lastPage=getLocalWithSafeDecode("lastPage");
			state.basket=getLocalWithSafeDecode("basket");
		},
		setValidUser: (state, action) => {
			state.userValid = true;
			state.groups = action.payload.groups;
			state.id = action.payload.id;
		},
		setValidPublic: (state) => {
			state.userValid = false;
			state.groups = [];
			state.id = undefined;
		},

		setSavedAttribute: (state, action) => {
			state[action.payload.attribute] = action.payload.value;
			localStorage.setItem(action.payload.attribute, JSON.stringify(action.payload.value));
		},



	}
});

export const {
	setValidUser,
	setValidPublic,
	setSavedAttribute,
	reloadProfile
} = userSlice.actions

export default userSlice.reducer