import React from 'react';
import {Switch, BrowserRouter as Router, Route} from 'react-router-dom';

import {useCookies} from "react-cookie";
import {configs, resources} from "themeLocaria";
import Openlayers from "libs/Openlayers";
import store from './redux/store'
import {Provider} from 'react-redux'

import AdminHome from "./admin/pages/adminHome";
import AdminContentPages from "./admin/pages/adminContentPages";
import AdminContentData from "./admin/pages/adminContentData";
import AdminContentPagesEdit from "./admin/pages/adminContentPagesEdit";


const AdminApp = () => {

	// fix our cookie defaults

	//const cognitoidentity = new AWS.CognitoIdentity({apiVersion: '2014-06-30'});

	/*const [cookies, setCookies] = useCookies(['location']);

	if (cookies.location === undefined) {
		const ol = new Openlayers();

		setCookies('location', configs.defaultLocation, {
			path: '/',
			sameSite: true
		});
	}
	if (cookies.distanceSelect === undefined) {
		setCookies('distanceSelect', configs.defaultDistanceSelect, {path: '/', sameSite: true});
	}
	if (cookies.distance === undefined) {
		setCookies('distance', configs.defaultDistance, {path: '/', sameSite: true});
	}
*/

	return (
		<Provider store={store}>
			<Router>
				<Switch>
					<Route exact path="/Admin/Content/Pages"  component={AdminContentPages}/>
					<Route exact path="/Admin/Content/Pages/Edit"  component={AdminContentPagesEdit}/>
					<Route exact path="/Admin/Content/Data"  component={AdminContentData}/>
					<Route exact path="/Admin/:id_token?" component={AdminHome}/>
					<Route exact path="/Admin/"  component={AdminHome}/>
					<Route exact path="/Admin/Home/"  component={AdminHome}/>
					<Route component={AdminHome}/>
				</Switch>
			</Router>
		</Provider>

	);
};

export default AdminApp;