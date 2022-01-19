import React, {useState} from 'react';
import {Switch, BrowserRouter as Router, Route} from 'react-router-dom';

import Home from "components/home";
import Report from "components/report";
import Category from 'components/category';
import View from 'components/view';
import Submit from 'components/submit';
import Page from 'components/page';
import Error from 'components/error';
import AdminHome from "components/admin/adminHome";
import AdminView from "components/admin/AdminView";
import AdminData from "components/admin/AdminData";
import AdminLoader from "components/admin/AdminLoader";
import {useCookies} from "react-cookie";
import {configs, resources} from "themeLocaria";
import Openlayers from "libs/Openlayers";

import AdminRoute from "./adminRoute";

import LocariaContext from './context/locariaContext';


const App = () => {

	// fix our cookie defaults

	//const cognitoidentity = new AWS.CognitoIdentity({apiVersion: '2014-06-30'});

	const [cookies, setCookies] = useCookies(['location']);

	const [user, setUser] = React.useState(false);

	if (cookies.location === undefined) {
		const ol = new Openlayers();

		setCookies('location', ol.decodeCoords(configs.defaultLocation, "EPSG:3857", "EPSG:4326"), {
			path: '/',
			sameSite: true
		});
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


	// Globals

	const [homeSearch, setHomeSearch] = useState('');

	const updateHomeSearch = (text) => {
		setHomeSearch(text);
	};

	const userSettings = {
		homeSearch: homeSearch,
		updateHomeSearch
	};


	React.useEffect(() => {


		//let {hash} = useLocation();
		let hash = window.location.hash;
		if (hash.match(/#id_token/)) {
			hash = hash.replace(/#id_token=/, '');
			hash = hash.replace(/&.*/, '');
		} else {
			hash = undefined;
		}

		window.websocket.registerQueue("tokenCheck", function (json) {
			if (json.packet.email) {
				// if its has its new, if not just keep the old one
				setUser(true);
				if (hash) {
					setCookies('id_token', hash, {path: '/', sameSite: true});
					setCookies('groups', json.packet['cognito:groups'], {path: '/', sameSite: true});
					const start = Date.now();
					const exp = (parseInt(json.packet.exp) * 1000)
					const diff = exp - (start + 60000);
					console.log(`Expires ${diff / 60000}`);
					setTimeout(function () {
						window.location = `https://${resources.cognitoURL}/login?response_type=token&client_id=${resources.cognitoPoolId}&redirect_uri=http://localhost:8080/`;
					}, diff);
				}

			} else {
				setCookies('id_token', null, {path: '/', sameSite: true});
				setCookies('groups', [], {path: '/', sameSite: true});
				// This is bad token so lets go home
				setUser(false);

			}
		});

		if (hash) {
			window.websocket.send({
				"queue": "tokenCheck",
				"api": "token",
				"data": {"id_token": hash}
			});
		} else {
			if (cookies['id_token'] !== 'null') {
				window.websocket.send({
					"queue": "tokenCheck",
					"api": "token",
					"data": {
						"id_token": cookies['id_token']
					}
				});
			} else {
				setUser(false);
			}
		}
	}, []);


	return (
			<LocariaContext.Provider value={userSettings}>
				<Router>
						<Switch>
							<AdminRoute path="/Admin/" user={user} component={AdminHome}/>
							<AdminRoute path="/AdminView/:feature" user={user} component={AdminView}/>
							<AdminRoute path="/AdminData/" user={user} component={AdminData}/>
							<AdminRoute path="/AdminLoader/" user={user} component={AdminLoader}/>

							<Route path="/Report/:category/:reportId/:feature?" component={Report}/>
							<Route path="/Category/:category/:searchLocation?/:searchDistance?" component={Category}/>
							<Route path="/View/:category/:feature" component={View}/>
							<Route path="/Submit/:category" component={Submit}/>
							<Route path="/Page/:page" component={Page}/>
							<Route exact path="/:id_token?" component={Home}/>

							<Route component={Error}/>
						</Switch>
				</Router>
			</LocariaContext.Provider>
	);
};

export default App;