import {configureStore} from '@reduxjs/toolkit'
import categoryDrawSlice from './slices/categoryDrawSlice'
import searchDrawSlice from './slices/searchDrawSlice'
import viewDrawSlice from './slices/viewDrawSlice'
import multiSelectSlice from './slices/multiSelectSlice'
import menuDrawSlice from './slices/menuDrawSlice'
import pageDialog from './slices/pageDialogSlice'

export default configureStore({
	reducer: {
		categoryDraw: categoryDrawSlice,
		searchDraw: searchDrawSlice,
		viewDraw: viewDrawSlice,
		multiSelect: multiSelectSlice,
		menuDraw: menuDrawSlice,
		pageDialog: pageDialog
	}
})