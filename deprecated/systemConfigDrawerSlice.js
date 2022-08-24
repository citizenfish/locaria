import React from 'react';

import { createSlice } from '@reduxjs/toolkit'


export const systemConfigDrawerSlice = createSlice({
    name: 'systemConfigDrawer',
    initialState: {
        open: false,
        config: undefined
    },
    reducers: {
        openSystemConfigDrawer: (state) => {
            state.open =true;
        },
        closeSystemConfigDrawer: (state) => {
            state.open =false;
        },
        setSystemConfig: (state,action) => {
            state.config=action.payload;
        },
        setSystemConfigValue: (state,action) => {
            state.config[action.payload.key]=action.payload.value;
        }
    },
})

// Action creators are generated for each case reducer function
export const { openSystemConfigDrawer,closeSystemConfigDrawer,setSystemConfig,setSystemConfigValue } = systemConfigDrawerSlice.actions

export default systemConfigDrawerSlice.reducer