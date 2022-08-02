import React from 'react';

import {createSlice} from '@reduxjs/toolkit'


export const adminPagesSlice = createSlice({
	name: 'adminPages',
	initialState: {
		open: false,
		pages: undefined,
		page: "",
		style: undefined
	},
	reducers: {
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
		}
	},
})

// Action creators are generated for each case reducer function
export const {setPages, addPage, setPage, setStyle,updateStyle} = adminPagesSlice.actions

export default adminPagesSlice.reducer