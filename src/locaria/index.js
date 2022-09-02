import Websockets from "./libs/Websockets";
/*
 * Add react
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {theme, resources} from "themeLocaria";
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";


import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { v4 as uuidv4 } from 'uuid';

import cssOL from './components/css/ol.css';

import Channels from "libs/Channels";
let tries = 0;

window.websocket = new Websockets();

let cookieUUID=getCookie('uuid');

if(cookieUUID === undefined) {
    cookieUUID=uuidv4();
}

setCookie('uuid', cookieUUID, {path: '/', sameSite: true});

//console.log(cookieUUID);
window.websocket.init({"url": resources.websocket, "uuid":cookieUUID}, connected, closed, errored);

window.websocket.registerQueue('bulkConfigs', (json) => {

    window.systemMain = json.systemParams.packet.parameters.systemMain.data || {};
    window.systemPages = json.systemPages.packet.parameters || {};
    window.systemLang=json.systemParams.packet.parameters.langENG.data || {};
    window.siteMap=json.systemParams.packet.parameters.siteMap.data || [];
    window.systemCategories=new Channels(json.categories.packet.categories || {});
    document.title = window.systemLang.siteTitle;

    ReactDOM.render(<Main/>, document.getElementById('root'));
});

function setCookie(name,value,options) {
    let expires = "";
    if (options.days) {
        let date = new Date();
        date.setTime(date.getTime() + (options.days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/; samesite=strict;";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return undefined;
}

function connected() {
    window.websocket.sendBulk('bulkConfigs', [
        {
            "queue": "systemParams",
            "api": "api",
            "data": {
                "method": "get_parameters",
                "usage":"Config"
            }
        },
        {
            "queue": "systemPages",
            "api": "api",
            "data": {
                "method": "get_parameters",
                "usage":"Page",
                "delete_key":"data"
            }
        },
        {
            "queue": "categories",
            "api": "api",
            "data": {
                "method": "list_categories",
                "attributes" : "true"
            }
        }
        ]
    );
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
            <CssBaseline/>
            <App/>
        </ThemeProvider>
    )
}



