import React from 'react'
import {createSlice} from '@reduxjs/toolkit'

export const fileSelectSlice = createSlice({
    name: 'fileSelect',
    initialState: {
        currentSelected: '',
        files: [],
        refresh: false
    },

    reducers: {
        clearFile:(state,actions) => {
            state.currentSelected = '*'
        },
        setFile:(state, actions) => {
            state.currentSelected = actions.payload
        },
        setFiles:(state, actions) => {
            state.files = actions.payload
        },
        setRefresh:(state, actions) => {
            state.refresh = actions.payload
        }
    },
})

export const {clearFile,setFile,setFiles} = fileSelectSlice.actions

export default fileSelectSlice.reducer