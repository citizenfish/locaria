import {configureStore} from '@reduxjs/toolkit'
import searchDrawerSlice from './slices/searchDrawerSlice'
import viewDrawSlice from './slices/viewDrawerSlice'
import multiSelectSlice from './slices/multiSelectSlice'
import menuDrawSlice from './slices/menuDrawerSlice'
import pageDialog from './slices/pageDialogSlice'
import layoutSlice from './slices/layoutSlice'
import landingDrawSlice from "./slices/landingDrawerSlice";
import typeAhead from "./slices/typeAheadSlice";
import adminEditDrawerSlice from "../admin/redux/slices/editDrawerSlice";
import adminUploadDrawerSlice from "../admin/redux/slices/uploadDrawerSlice";
import adminEditFeatureDrawerSlice from "../admin/redux/slices/editFeatureDrawerSlice";
import adminSlice from "../admin/redux/slices/adminSlice";
import systemConfigDrawerSlice from "../admin/redux/slices/systemConfigDrawerSlice";
import adminPageDrawerSlice from "../admin/redux/slices/adminPageDrawerSlice"

export default configureStore({
	reducer: {
		searchDraw: searchDrawerSlice,
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
		adminSlice: adminSlice,
		systemConfigDrawer:systemConfigDrawerSlice,
		adminPageDrawer: adminPageDrawerSlice
	}
})