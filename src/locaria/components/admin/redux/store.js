import {configureStore} from '@reduxjs/toolkit'

import adminPagesSlice from "./slices/adminPagesSlice";

export default configureStore({
	reducer: {
		adminPages: adminPagesSlice,
	}
})