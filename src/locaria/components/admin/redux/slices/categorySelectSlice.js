import React from 'react'
import {createSlice} from '@reduxjs/toolkit'

export const categorySelectSlice = createSlice({
    name: 'categorySelect',
    initialState: {
        currentSelected: '*',
        categories: []
    },
    reducers: {
        clearCategory:(state,actions) => {
            state.currentSelected = '*'
        },
        setCategory:(state, actions) => {
            state.currentSelected = actions.payload
        },
        setCategories:(state, actions) => {
            state.categories = actions.payload
        }
    },
})

export const {clearCategory,setCategory,setCategories} = categorySelectSlice.actions

export default categorySelectSlice.reducer