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
			searchText:"Where are you?",
			toggles:{}
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
		searchText:undefined,
		toggles:undefined
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

			// loop localDefs and load
			// wtf does this not work? proxy issue
			/*for(let i in Object.keys(state.localDefs)) {
				console.log(i);
				state[i]=getLocalWithSafeDecode(i);
			}

			console.log(state);
*/

			state.question1=getLocalWithSafeDecode("question1");
			state.question2=getLocalWithSafeDecode("question2");
			state.gotoCategory=getLocalWithSafeDecode("gotoCategory");
			state.askQuestions=getLocalWithSafeDecode("askQuestions");
			state.recentLocations=getLocalWithSafeDecode("recentLocations");
			state.currentLocation=getLocalWithSafeDecode("currentLocation");
			state.lastPage=getLocalWithSafeDecode("lastPage");
			state.basket=getLocalWithSafeDecode("basket");
			state.searchText=getLocalWithSafeDecode("searchText");
			state.idToken=getLocalWithSafeDecode("idToken");
			state.toggles=getLocalWithSafeDecode("toggles");
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

		setToggleActiveTop: (state,action) => {
			if(state.toggles[action.payload.id])
				state.toggles[action.payload.id]={open:state.toggles[action.payload.id].open,active:action.payload.value};
			else
				state.toggles[action.payload.id]={open:true,active:action.payload.value};
		}



	}
});

export const {
	setValidUser,
	setValidPublic,
	setToggleActiveTop,
	setSavedAttribute,
	reloadProfile
} = userSlice.actions

export default userSlice.reducer