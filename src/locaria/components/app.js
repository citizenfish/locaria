import React from 'react';
import {Switch, BrowserRouter as Router, Route, Redirect} from 'react-router-dom';

import Maintenance from 'components/maintenance';
import {useCookies} from "react-cookie";
import {configs, resources} from "themeLocaria";
import Openlayers from "libs/Openlayers";
import store from './redux/store'
import {Provider} from 'react-redux'

import RenderPage from "./widgets/markdown/renderPage";
import * as PropTypes from "prop-types";
import CookieConsent from "react-cookie-consent";


const App = () => {

	// fix our cookie defaults

	//const cognitoidentity = new AWS.CognitoIdentity({apiVersion: '2014-06-30'});

	const [cookies, setCookies] = useCookies(['location']);

	const [user, setUser] = React.useState(false);

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
			if(cookies['after']==="true") {
				setCookies('after', false, {path: '/', sameSite: true});
				if(cookies['last']!==undefined)
					window.location=cookies['last'];
			}
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
						window.location = `https://${resources.cognitoURL}/login?response_type=token&client_id=${resources.poolClientId}&redirect_uri=${location.protocol}//${location.host}/`;
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


	if (configs.siteMaintenance === true) {
		return (
			<Provider store={store}>
				<Router>
					<Switch>
						<Route component={Maintenance}/>
					</Switch>
				</Router>
			</Provider>
		)
	} else {

		return (
			<Provider store={store}>
				<Router>
					<Switch>
						<Route path="/Login/" component={() => {
							setCookies('after', true, {path: '/', sameSite: true});
							window.location = `https://${resources.cognitoURL}/login?response_type=token&client_id=${resources.poolClientId}&redirect_uri=${location.protocol}//${location.host}/`;
						}}/>
						<Route path="/SignUp/" component={() => {
							setCookies('after', true, {path: '/', sameSite: true});
							window.location = `https://${resources.cognitoURL}/signup?response_type=token&client_id=${resources.poolClientId}&redirect_uri=${location.protocol}//${location.host}/`;
						}}/>
						<Route path="/:page/fp/:category?/:feature?" component={RenderPage}/>
						<Route path="/:page/sp/:category?/:search(.*)?">
							<RenderPage searchMode={true}/>
						</Route>
						<Route path="/:page/" component={RenderPage}/>
						<Route path="/" component={RenderPage}></Route>
						<Route exact path="/:id_token?" component={RenderPage}/>

						<Route component={RenderPage}/>
					</Switch>
				</Router>
				<CookieConsent>This website uses cookies to enhance the user experience only, we do not issue 3rd party
					cookies.</CookieConsent>
			</Provider>
		);
	}
};

export default App;