import React from 'react';

import { createSlice } from '@reduxjs/toolkit'


export const adminLanguageDrawerSlice = createSlice({
    name: 'adminLanguageDrawer',
    initialState: {
        open: false,
        language: {}
    },
    reducers: {
        openLanguageDrawer: (state) => {
            state.open =true;
        },
        closeLanguageDrawer: (state) => {
            state.open =false;
        },
        setAdminLanguage: (state,actions) => {
            state.language=actions.payload;
        },
        setAdminLanguageValue: (state,actions) => {
            state.language[actions.payload.category][actions.payload.key]=actions.payload.value;
        }
    },
})

// Action creators are generated for each case reducer function
export const { openLanguageDrawer,closeLanguageDrawer,setAdminLanguage,setAdminLanguageValue} = adminLanguageDrawerSlice.actions

export default adminLanguageDrawerSlice.reducer