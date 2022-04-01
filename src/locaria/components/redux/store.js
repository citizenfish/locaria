import {configureStore} from '@reduxjs/toolkit'
import searchDrawSlice from './slices/searchDrawSlice'
import viewDrawSlice from './slices/viewDrawSlice'
import multiSelectSlice from './slices/multiSelectSlice'
import menuDrawSlice from './slices/menuDrawSlice'
import pageDialog from './slices/pageDialogSlice'
import layoutSlice from './slices/layoutSlice'
import landingDrawSlice from "./slices/landingDrawSlice";
import typeAhead from "./slices/typeAheadSlice";
import adminEditDrawerSlice from "../admin/redux/slices/editDrawerSlice";
import adminUploadDrawerSlice from "../admin/redux/slices/uploadDrawerSlice";
import adminEditFeatureDrawerSlice from "../admin/redux/slices/editFeatureDrawerSlice";
import adminSlice from "../admin/redux/slices/adminSlice";

export default configureStore({
	reducer: {
		searchDraw: searchDrawSlice,
		viewDraw: viewDrawSlice,
		multiSelect: multiSelectSlice,
		menuDraw: menuDrawSlice,
		pageDialog: pageDialog,
		layout: layoutSlice,
		landingDraw: landingDrawSlice,
		typeAhead: typeAhead,
		adminEditDrawer: adminEditDrawerSlice,
		adminUploadDrawer: adminUploadDrawerSlice,
		adminEditFeatureDrawer: adminEditFeatureDrawerSlice,
		adminSlice: adminSlice
	}
})