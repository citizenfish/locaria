import React from 'react';
import {Switch, BrowserRouter as Router, Route} from 'react-router-dom';

import {resources} from "themeLocaria";

import RenderPage from "./widgets/markdown/renderPage";
import CookieConsent from "react-cookie-consent";


const App = () => {

		return (
			<>
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
				<CookieConsent>This website does not use cookies</CookieConsent>
			</>
		);
};

export default App;