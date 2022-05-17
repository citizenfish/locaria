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
            for(let c in actions.payload.data) {
                for(let d in actions.payload.defaults) {
                    if(actions.payload.data[c][d]===undefined) {
                        actions.payload.data[c][d]=actions.payload.defaults[d];
                    }
                }
                actions.payload.data[c].fields=JSON.stringify(actions.payload.data[c].fields);
            }
            state.categories=actions.payload.data;
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