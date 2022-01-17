import { createTheme } from '@mui/material/styles';

import UseStyles from './styles';
// Channel Images
import channelPlanning from './images/channel-planning.jpg';
import channelDemocracy from './images/channel-democracy.jpg';
import channelEvents from './images/channel-events.jpg';
import channelReported from './images/channel-reported.jpg';

// Channel icons

import iconDefault from './images/marker.svg';
import iconPlanning from './images/marker-planning.svg';
import iconEvents from './images/marker-events.svg';
import iconCrime from './images/marker-crime.svg';
import Channels from "../../locaria/libs/Channels";
import Pages from "../../locaria/libs/Pages";
import React from 'react';


//https://next.material-ui.com/customization/palette/
const theme = createTheme({
	palette: {
		primary: {
			main: '#ff9d00',
		},
		secondary: {
			main: '#f44336',
		}
	}
});

const useStyles = new UseStyles(theme).get();

const channels = new Channels();

channels.addChannel('Planning', {
	"key": "Planning",
	"type": "Category",
	"name": "Planning",
	"description": "Find all Conservation Areas, Tree Preservation Orders, Listed Buildings and view Planning Applications received within the last 30 days.",
	"category": "Planning",
	"image": `${channelPlanning}`,
	"mapIcon": iconPlanning,
	"color": "#4a94e9",
	"search": [{"component": "SearchDistance"}, {"component": "SearchTags"}],
	"fields": [
		{
			"type": "text",
			"name": "Title",
			"key": "title"
		},
		{
			"type": "text",
			"name": "Description of application",
			"key": "text"
		}
	],
	"submit": "planning_applications",
	"display": true

});
channels.addChannel('Events', {
	"key": "Events",
	"type": "Category",
	"name": "Events",
	"description": "A list of events and happenings running in your area",
	"category": "Events",
	"image": `${channelEvents}`,
	"mapIcon": iconEvents,
	"color": "#df7f2b",
	"tags": {
		"Arts": {
			"mapIcon": `${iconEvents}`,
			"color": "#df7f2b"
		}
	}

});
channels.addChannel('Crime', {
	"key": "Crime",
	"type": "Category",
	"name": "Crime",
	"description": "View Crime data, accessed via the Police Crime Data API. The data does not show cases within the last three months. Figures obtained from Police.UK.",
	"category": "Crime",
	"image": `${channelReported}`,
	"mapIcon": iconCrime,
	"color": "#c31d49",

});
channels.addChannel('Democracy', {
	"key": "Democracy",
	"type": "Report",
	"name": "Democracy",
	"description": "Find information about wards, parishes, councillors, MPs, polling stations and council tax in your selected location.",
	"report_name": "democracy_location",
	"image": `${channelDemocracy}`,
	"mapIcon": iconDefault,
	"color": "#000000",
	"noCategory": true

});
channels.addChannel('All', {
	"key": "All",
	"type": "Category",
	"name": "All",
	"description": "View all categories",
	"category": "*",
	"image": `${channelReported}`,
	"display": false,
	"mapIcon": iconDefault
});

const pages=new Pages();

pages.addPage('help',{title:"Some page"},<h1>This is some data</h1>)


const configs = {
	mapXYZ: 'https://api.os.uk/maps/raster/v1/zxy/Road_3857/{z}/{x}/{y}.png?key=w69znUGxB6IW5FXkFMH5LQovdZxZP7jv',
	mapAttribution: "© Crown copyright and database rights 2021 OS 123456",
	mapBuffer: 50000,
	cluster: true, // true|false
	clusterCutOff: 1.5,
	clusterWidthMod: 50,
	siteTitle: "Locaria - My council",
	homeGrid: 3,
	homeCategorySearch: ["Planning", "Events", "Crime"],
	defaultZoom: 12,
	defaultPostcode: "E1",
	defaultLocation: [5176.36, 6712961.88], // EPSG:3857
	defaultDistanceSelect: 'km', // km|mile
	defaultDistance: 10, // km|mile
	defaultMapIcon: iconDefault,
	searchIcon: iconPlanning,
	navShowHome: true

}

const resources = require('./resources.json');

export {useStyles, channels, theme, configs, resources,pages};
