import React from 'react';
import {Switch, BrowserRouter as Router, Route} from 'react-router-dom';

import Home from './home';
import Report from './report';
import Category from './category';
import View from './view';
import Error from './error';
import AdminHome from "./admin/adminHome";
import {useCookies} from "react-cookie";
import {configs} from "themeLocus";


const App = () => {

	// fix our cookie defaults

	const [cookies, setCookies] = useCookies(['location']);
	if (cookies.location === undefined) {
		setCookies('location', configs.defaultLocation, {path: '/', sameSite: true});
	}
	if (cookies.postcode === undefined) {
		setCookies('postcode', configs.defaultPostcode, {path: '/', sameSite: true});
	}
	if (cookies.distanceSelect === undefined) {
		setCookies('distanceSelect', configs.defaultDistanceSelect, {path: '/', sameSite: true});
	}
	if (cookies.distance === undefined) {
		setCookies('distance', configs.defaultDistance, {path: '/', sameSite: true});
	}

	return (
		<Router>
			<div>
				<Switch>
					<Route path="/Admin/" component={AdminHome}/>
					<Route path="/Report/:reportId" component={Report}/>
					<Route path="/Category/:category/:searchLocation?/:searchDistance?" component={Category}/>
					<Route path="/View/:category/:feature" component={View}/>
					<Route exact path="/:id_token?" component={Home}/>

					<Route component={Error}/>
				</Switch>
			</div>
		</Router>
	);
};

export default App;