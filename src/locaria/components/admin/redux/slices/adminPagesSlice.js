import React from 'react';

import {createSlice} from '@reduxjs/toolkit'


export const adminPagesSlice = createSlice({
	name: 'adminPages',
	initialState: {
		open: false,
		pages: undefined,
		page: "",
		style: undefined,
		overview: undefined,
		feature: undefined,
		editor: undefined,
		awaitUI: false,
		user:false,
		token: undefined
	},
	reducers: {
		setToken:(state,action) => {
			state.token=action.payload;
		},
		clearUI:(state,actions) => {
			state.awaitUI=false;
		},
		setFeature:(state, actions) => {
			state.feature = actions.payload;
		},
		saveFeature:(state,actions) => {
			debugger;
		},
		setPages: (state, actions) => {
			state.pages = actions.payload;
		},
		addPage: (state, actions) => {
			state.pages.push(actions.payload);
		},
		setPage: (state, actions) => {
			state.page = actions.payload;
		},
		setStyle: (state, actions) => {
			state.style = actions.payload;
		},
		setOverview: (state, actions) => {
			if(actions.payload===undefined) {
				state.overview = undefined;
			} else {
				actions.payload.total_updates = actions.payload['add_item'] + actions.payload['delete_item'] + actions.payload['update_item'];
				state.overview = actions.payload;
			}
		},
		updateStyle: (state,actions) => {
			if(actions.payload.data)
				window.systemMain.styles[actions.payload.style]={...window.systemMain.styles[actions.payload.style],...actions.payload.data};

			if(actions.payload.delete)
				delete window.systemMain.styles[actions.payload.style][actions.payload.delete];

			if(actions.payload.purge)
				delete window.systemMain.styles[actions.payload.style];

			if(actions.payload.add) {
				window.systemMain.styles[actions.payload.style] = {};
				state.style = actions.payload.style;
			}


			window.websocket.registerQueue('setConfig', (json) => {
				console.log('config saved');
				state.awaitUI=true;
			});

			window.websocket.send({
				"queue": "setConfig",
				"api": "sapi",
				"data": {
					"acl": {},
					"method": "set_parameters",
					"parameter_name": "systemMain",
					id_token: actions.payload.token,
					"usage": "Config",
					"parameters":  window.systemMain
				}
			});
		},
		setEditor: (state,actions) => {
			state.editor = actions.payload;
		},
		setUser: (state,action) => {
			state.user = action.payload;
		}

	},
})

// Action creators are generated for each case reducer function
export const {setPages, addPage, setPage, setStyle,updateStyle,setOverview,setFeature,clearUI,setEditor,setUser,setToken} = adminPagesSlice.actions

export default adminPagesSlice.reducer