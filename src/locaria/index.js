import Websockets from "./libs/Websockets";
/*
 * Add react
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {theme,configs, resources} from "themeLocaria";
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";


import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import cssOL from './components/css/ol.css';

let tries = 0;

document.title = configs.siteTitle;
window.websocket = new Websockets();

window.websocket.init({"url": resources.websocket}, connected, closed, errored);


function connected() {

	ReactDOM.render(<Main/>, document.getElementById('root'));
}

function closed(event) {
	console.log(`websock closed: ${event}`);
	if (tries <= 3)
		window.websocket.connect();
}

function errored(event) {
	tries++;
	console.log(`websock errored: ${event}`);
	if (tries > 2) {
		ReactDOM.render(<Main/>, document.getElementById('root'));
	}
}

function Main() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<App/>
		</ThemeProvider>
	)
}



