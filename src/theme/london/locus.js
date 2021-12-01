import React from 'react';
import {alpha, makeStyles, createTheme} from '@material-ui/core/styles';
import Channels from 'libs/Channels'

// Channel Images

import channelArt from './images/arts.png';
import channelCommunity from './images/community.png';
import channelMusic from './images/music.png';
import channelSport from './images/sport.png';
import channelDance from './images/dance.png';
import channelEducational from './images/educational.png';
import channelTech from './images/tech.png';
import channelGeneral from './images/general.png';

// map icons

import iconDefault from './images/icons/marker-unknown.svg';
import iconArts from './images/icons/marker-arts-selected.svg';
import iconCommunity from './images/icons/marker-community-selected.svg';
import iconMusic from './images/icons/marker-music-selected.svg';
import iconSport from './images/icons/marker-sport-selected.svg';
import iconDance from './images/icons/marker-dance-selected.svg';
import iconEducational from './images/icons/marker-educational-selected.svg';
import iconTech from './images/icons/marker-tech-selected.svg';
import iconGeneral from './images/icons/marker-general-selected.svg';
import UseStyles from "../default/styles";


//https://next.material-ui.com/customization/palette/
const theme = createTheme({
	palette: {
		primary: {
			main: '#353d42',
		},
		secondary: {
			main: '#e7236e',
			dark: '#831239'
		},
	},
	typography: {
		fontFamily: [
			'Arial'
		].join(','),
	}
});

const useStyles = new UseStyles(theme).get();


const channels = new Channels();

const tags = {
	"Arts": {
		"mapIcon": `${iconArts}`,
		"color": "#df7f2b"
	},
	"Community": {
		"mapIcon": `${iconCommunity}`,
		"color": "#e95814"
	},
	"Dance": {
		"mapIcon": `${iconDance}`,
		"color": "#792d89"
	},
	"Educational": {
		"mapIcon": `${iconEducational}`,
		"color": "#14587e"
	},
	"Music": {
		"mapIcon": `${iconMusic}`,
		"color": "#9e125b"
	},
	"Sport": {
		"mapIcon": `${iconSport}`,
		"color": "#0f8e47"
	},
	"Tech": {
		"mapIcon": `${iconTech}`,
		"color": "#1aabe3"
	}
};

channels.addChannel('Events', {
	"key": "Events",
	"type": "Category",
	"name": "Search",
	"description": "Find all events in your local area.",
	"category": "Events",
	"image": `${channelGeneral}`,
	"mapIcon": iconGeneral,
	"color": "#4a94e9",
	"display": true,
	"tags": tags,
	"search": [{"component": "SearchDistance", "max": 50}, {"component": "SearchTags"}, {
		"component": "SearchRange",
		"title": "Age",
		"min": 0,
		"max": 25
	}]
});


channels.addChannel('Arts', {
	"key": "Arts",
	"type": "Category",
	"name": "Art",
	"description": "Find all Art events in your local area.",
	"category": "Events",
	"filterTags": ["Arts"],
	"image": `${channelArt}`,
	"mapIcon": iconArts,
	"color": "#dca000",
	"tags": tags
});

channels.addChannel('Community', {
	"key": "Community",
	"type": "Category",
	"name": "Community",
	"description": "Find all Community events in your local area.",
	"category": "Events",
	"filterTags": ["Community"],
	"image": `${channelCommunity}`,
	"mapIcon": iconCommunity,
	"color": "#e95814",
	"tags": tags
});

channels.addChannel('Dance', {
	"key": "Dance",
	"type": "Category",
	"name": "Dance",
	"description": "Find all Dance events in your local area.",
	"category": "Events",
	"filterTags": ["Dance"],
	"image": `${channelDance}`,
	"mapIcon": iconDance,
	"color": "#792d89",
	"tags": tags
});

channels.addChannel('Educational', {
	"key": "Educational",
	"type": "Category",
	"name": "Educational",
	"description": "Find all Educational events in your local area.",
	"category": "Events",
	"filterTags": ["Educational"],
	"image": `${channelEducational}`,
	"mapIcon": iconEducational,
	"color": "#14587e",
	"tags": tags
});

channels.addChannel('Music', {
	"key": "Music",
	"type": "Category",
	"name": "Music",
	"description": "Find all Music events in your local area.",
	"category": "Events",
	"filterTags": ["Music"],
	"image": `${channelMusic}`,
	"mapIcon": iconMusic,
	"color": "#9e125b",
	"tags": tags
});

channels.addChannel('Sport', {
	"key": "Sport",
	"type": "Category",
	"name": "Sport",
	"description": "Find all Sporting events in your local area.",
	"category": "Events",
	"filterTags": ["Sport"],
	"image": `${channelSport}`,
	"mapIcon": iconSport,
	"color": "#0f8e47",
	"tags": tags
})

channels.addChannel('Tech', {
	"key": "Tech",
	"type": "Category",
	"name": "Tech",
	"description": "Find all Tech events in your local area.",
	"category": "Events",
	"filterTags": ["Tech"],
	"image": `${channelTech}`,
	"mapIcon": iconTech,
	"color": "#1aabe3",
	"tags": tags
});


const configs = {
	OSKey: "vmRzM4mAA1Ag0hkjGh1fhA2hNLEM6PYP",
	OSLayer: "Light_3857",
	OSAttribution: "© Crown copyright and database rights 2021 OS 123456",
	cluster: true, // true|false
	clusterCutOff: 8,
	clusterWidthMod: 25,
	siteTitle: "OUR LONDON",
	homeGrid: 3,
	homeCategorySearch: "Events",
	defaultZoom: 12,
	defaultPostcode: "E1",
	defaultLocation: [5176.36, 6712961.88], // EPSG:3857
	defaultDistanceSelect: 'km', // km|mile
	defaultDistance: 10, // km|mile
	defaultMapIcon: iconDefault,
	websocket: "wss://mpk9us5un9.execute-api.eu-west-1.amazonaws.com/new", // Get his this from your locus-custom.yml - wsdomain
	cognitoURL: "locusauth.nautoguide.com", // Get his this from your locus-custom.yml - cognitoDomainName
	cognitoPoolId: "6jbgpggjvqonk7p55m51rql445" // Get from you api/.env
}

export {useStyles, channels, theme, configs};
