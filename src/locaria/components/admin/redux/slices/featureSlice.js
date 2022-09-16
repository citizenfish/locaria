import React from 'react'
import {createSlice} from '@reduxjs/toolkit'

export const featureSlice = createSlice({
    name: 'featureState',
    initialState: {
        currentSelected: '',
        moderations: []
    },
    reducers: {
        clearModerations:(state,actions) => {
            state.moderations = []
        },
        setModerations:(state, actions) => {
            state.moderations = actions.payload
        }
    },
})

export const {clearModerations,setModerations} = featureSlice.actions

export default featureSlice.reducer