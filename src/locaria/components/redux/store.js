import {configureStore} from '@reduxjs/toolkit'
import searchDrawerSlice from './slices/searchDrawerSlice'
import viewDrawSlice from './slices/viewDrawerSlice'
import multiSelectSlice from './slices/multiSelectSlice'
import menuDrawSlice from './slices/menuDrawerSlice'
import pageDialog from './slices/pageDialogSlice'
import layoutSlice from './slices/layoutSlice'
import landingDrawSlice from "./slices/landingDrawerSlice";
import homeDrawerSlice from "./slices/homeDrawerSlice";
import typeAhead from "./slices/typeAheadSlice";

import mediaSlice from "./slices/mediaSlice";

export default configureStore({
	reducer: {
		searchDraw: searchDrawerSlice,
		viewDraw: viewDrawSlice,
		multiSelect: multiSelectSlice,
		menuDraw: menuDrawSlice,
		pageDialog: pageDialog,
		layout: layoutSlice,
		landingDraw: landingDrawSlice,
		homeDrawer: homeDrawerSlice,
		typeAhead: typeAhead,
		mediaSlice: mediaSlice
	}
})