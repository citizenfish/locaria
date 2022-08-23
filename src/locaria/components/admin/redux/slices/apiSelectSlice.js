import React from 'react'
import {createSlice} from '@reduxjs/toolkit'

export const apiSelectSlice = createSlice({
    name: 'apiSelect',
    initialState: {
        currentSelected: '',
        apis: [],
        filesConfigured: {}
    },
    reducers: {
        clearApis:(state,actions) => {
            state.currentSelected = ''
        },
        setApi:(state, actions) => {
            state.currentSelected = actions.payload
        },
        setApis:(state, actions) => {
            state.apis = actions.payload
        },
        //These are files that have custom_loaders and cron settings hence are live APIS
        setFilesConfigured:(state, actions) => {
            state.filesConfigured = actions.payload
        }
    },
})

export const {clearApis, setApi, setApis, setFilesConfigured} = apiSelectSlice.actions

export default apiSelectSlice.reducer