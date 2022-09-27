import {configureStore} from '@reduxjs/toolkit'

import adminPagesSlice from "./slices/adminPagesSlice"
import categorySelectSlice from "./slices/categorySelectSlice"
import apiSelectSlice from "./slices/apiSelectSlice";
import fileSelectSlice from "./slices/fileSelectSlice";
import featureSlice from "./slices/featureSlice";
import formSlice from "../../redux/slices/formSlice";

export default configureStore({
	reducer: {
		adminPages: adminPagesSlice,
		categorySelect: categorySelectSlice,
		apiSelect: apiSelectSlice,
		fileSelect: fileSelectSlice,
		featureState: featureSlice,
		formSlice: formSlice

	}
})