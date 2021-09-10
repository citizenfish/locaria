import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './home';
import Report from './report';
import Category from './category';
import View from './view';
import Error from './error';
import {useCookies} from "react-cookie";
import {configs} from "theme_locus";


const App = () => {

	// fix our cookie defaults

	const [location, setLocation] = useCookies(['location']);
	if(location.location===undefined) {
		setLocation('location', configs.defaultLocation, {path: '/',sameSite:true});
		setLocation('postcode', configs.defaultPostcode, {path: '/',sameSite:true});
		setLocation('distanceSelect', configs.defaultDistanceSelect, {path: '/',sameSite:true});
		setLocation('range', configs.defaultRange, {path: '/',sameSite:true});
	}

	return (
		<Router>
			<div>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route path="/Report/:reportId" component={Report} />
					<Route path="/Category/:category" component={Category} />
					<Route path="/View/:category/:feature" component={View} />
					<Route component={Error} />
				</Switch>
			</div>
		</Router>
	);
};

export default App;