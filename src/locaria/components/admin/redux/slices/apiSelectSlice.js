import React from 'react'
import {createSlice} from '@reduxjs/toolkit'

export const apiSelectSlice = createSlice({
    name: 'apiSelect',
    initialState: {
        currentSelected: '',
        apis: []
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
        }
    },
})

export const {clearApis,setApi,setApis} = apiSelectSlice.actions

export default apiSelectSlice.reducer