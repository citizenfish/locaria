import {configureStore} from '@reduxjs/toolkit'
import searchDrawerSlice from './slices/searchDrawerSlice'
import viewDrawSlice from './slices/viewDrawerSlice'
import multiSelectSlice from './slices/multiSelectSlice'
import menuDrawSlice from './slices/menuDrawerSlice'
import pageDialog from './slices/pageDialogSlice'
import layoutSlice from './slices/layoutSlice'
import typeAhead from "./slices/typeAheadSlice";

import mediaSlice from "./slices/mediaSlice";
import formSlice from "./slices/formSlice";

import adminPagesSlice from "../admin/redux/slices/adminPagesSlice"
import categorySelectSlice from "../admin/redux/slices/categorySelectSlice"
import apiSelectSlice from "../admin/redux/slices/apiSelectSlice";
import fileSelectSlice from "../admin/redux/slices/fileSelectSlice";
import featureSlice from "../admin/redux/slices/featureSlice";

export default configureStore({
	reducer: {
		searchDraw: searchDrawerSlice,
		viewDraw: viewDrawSlice,
		multiSelect: multiSelectSlice,
		menuDraw: menuDrawSlice,
		pageDialog: pageDialog,
		layout: layoutSlice,
		typeAhead: typeAhead,
		mediaSlice: mediaSlice,
		formSlice: formSlice,
//admin

		adminPages: adminPagesSlice,
		categorySelect: categorySelectSlice,
		apiSelect: apiSelectSlice,
		fileSelect: fileSelectSlice,
		featureState: featureSlice

	}
})