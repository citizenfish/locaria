import React from 'react';

import { createSlice } from '@reduxjs/toolkit'


export const adminCategoryDrawerSlice = createSlice({
    name: 'systemConfigDrawer',
    initialState: {
        open: false,
        categories: []
    },
    reducers: {
        openAdminCategoryDrawer: (state) => {
            state.open =true;
        },
        closeAdminCategoryDrawer: (state) => {
            state.open =false;
        },
        setAdminCategories: (state,actions) => {
            state.categories=actions.payload;
        },
        setAdminCategoryValue: (state,actions) => {
            for(let category in state.categories) {
                if(actions.payload.category===state.categories[category].key) {
                    state.categories[category][actions.payload.key] = actions.payload.value;
                }
            }
        }
    },
})

// Action creators are generated for each case reducer function
export const { openAdminCategoryDrawer,closeAdminCategoryDrawer,setAdminCategories,setAdminCategoryValue} = adminCategoryDrawerSlice.actions

export default adminCategoryDrawerSlice.reducer