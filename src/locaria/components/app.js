import React from 'react';
import {Switch, BrowserRouter as Router, Route} from 'react-router-dom';

import Maintenance from 'components/maintenance';
import Admin from "components/admin/admin";
import {useCookies} from "react-cookie";
import {configs, resources} from "themeLocaria";
import Openlayers from "libs/Openlayers";
import store from './redux/store'
import { Provider } from 'react-redux'

import AdminRoute from "./adminRoute";
import LayoutApp from "./widgets/layouts/layoutApp";
import LayoutPages from "./widgets/layouts/layoutPages";



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

	let layout=LayoutApp;
	if(window.systemMain.layoutType&&window.systemMain.layoutType==='Pages') {
		layout=LayoutPages;
	}

	if(configs.siteMaintenance===true) {
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
							<Route path="/Admin/Upload/" user={user} component={Admin}/>
							<Route path="/Admin/Edit/:feature?" user={user} component={Admin}/>
							<Route path="/Admin/" user={user} component={Admin}/>
							<Route exact path="/Admin/:id_token?" component={Admin}/>

							<Route path="/View/:category/:feature" component={layout}/>
							<Route path="/Search/:category?/:search?" component={layout}/>
							<Route path="/Page/:page" component={layout}/>
							<Route path="/Map" component={layout}/>
							<Route path="/Home" component={layout}/>
							<Route path="/" component={layout}></Route>
							<Route exact path="/:id_token?" component={layout}/>

							<Route component={layout}/>
						</Switch>
					</Router>
			</Provider>
		);
	}
};

export default App;