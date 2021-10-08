import React from 'react';
import {Switch, BrowserRouter as Router, Route, useLocation} from 'react-router-dom';

import Home from './home';
import Report from './report';
import Category from './category';
import View from './view';
import Error from './error';
import AdminHome from "./admin/adminHome";
import AdminView from "./admin/AdminView";
import {useCookies} from "react-cookie";
import {configs} from "themeLocus";
import ReactDOM from "react-dom";


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
	React.useEffect(() => {


		//let {hash} = useLocation();
		let hash = window.location.hash;
		if (hash.match(/#id_token/)) {
			hash = hash.replace(/#id_token=/, '');
			hash = hash.replace(/\&.*/, '');
		} else {
			hash = undefined;
		}

		window.websocket.registerQueue("tokenCheck", function (json) {
			console.log(json);
			if (json.packet.email) {
				// if its has its new, if not just keep the old one
				if (hash) {
					setCookies('id_token', hash, {path: '/', sameSite: true});
					setCookies('groups', json.packet['cognito:groups'], {path: '/', sameSite: true});
				}

			} else {
				setCookies('id_token', null, {path: '/', sameSite: true});
				setCookies('groups', [], {path: '/', sameSite: true});

			}
		});

		if (hash) {
			console.log(`Incoming ${hash}`);
			window.websocket.send({
				"queue": "tokenCheck",
				"api": "token",
				"data": {"id_token": hash}
			});
		} else {
			if (cookies['id_token'] !== 'null') {
				console.log('check id_token');
				window.websocket.send({
					"queue": "tokenCheck",
					"api": "token",
					"data": {
						"id_token": cookies['id_token']
					}
				});
			} else {
				console.log('id_token null');

			}
		}
	}, []);


	return (
		<Router>
			<div>
				<Switch>
					<Route path="/Admin/" component={AdminHome}/>
					<Route path="/Report/:reportId" component={Report}/>
					<Route path="/Category/:category/:searchLocation?/:searchDistance?" component={Category}/>
					<Route path="/AdminView/:feature" component={AdminView}/>
					<Route path="/View/:category/:feature" component={View}/>
					<Route exact path="/:id_token?" component={Home}/>

					<Route component={Error}/>
				</Switch>
			</div>
		</Router>
	);
};

export default App;