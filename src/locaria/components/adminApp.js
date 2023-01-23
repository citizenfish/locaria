import React from 'react';

import store from './redux/store'
import {Provider} from 'react-redux'
import AdminAppRouter from "components/admin/components/router/router";



const AdminApp = () => {


	return (
		<Provider store={store}>
			<AdminAppRouter/>
		</Provider>

	);
};

export default AdminApp;