import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './home';
import Report from './report';
import Error from './error';
/*import DynamicPage from './DynamicPage';
import NoMatch from './NoMatch';*/

const App = () => {
	return (
		<Router>
			<div>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/Report" component={Report} />
					<Route component={Error} />
				</Switch>
			</div>
		</Router>
	);
};

export default App;