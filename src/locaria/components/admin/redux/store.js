import {configureStore} from '@reduxjs/toolkit'

import adminPagesSlice from "./slices/adminPagesSlice"
import categorySelectSlice from "./slices/categorySelectSlice"

export default configureStore({
	reducer: {
		adminPages: adminPagesSlice,
		categorySelect: categorySelectSlice
	}
})