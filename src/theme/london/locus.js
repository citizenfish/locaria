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

const useStyles = makeStyles((theme) => ({

		grow: {
			flexGrow: 1,
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		title: {
			display: 'none',
			[theme.breakpoints.up('sm')]: {
				display: 'block',
			},
		},
		search: {
			position: 'relative',
			borderRadius: theme.shape.borderRadius,
			backgroundColor: alpha(theme.palette.common.white, 0.15),
			'&:hover': {
				backgroundColor: alpha(theme.palette.common.white, 0.25),
			},
			marginRight: theme.spacing(2),
			width: '100%',
			[theme.breakpoints.up('sm')]: {
				marginLeft: theme.spacing(3),
				width: 'auto',
			},
		},
		searchIcon: {
			padding: theme.spacing(0, 2),
			height: '100%',
			position: 'absolute',
			pointerEvents: 'none',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		inputRoot: {
			color: 'inherit'
		},
		inputInput: {
			//padding: theme.spacing(1, 1, 1, 0),
			// vertical padding + font size from searchIcon
			//paddingLeft: '50px',
			transition: theme.transitions.create('width'),
			width: '100%',
			[theme.breakpoints.up('md')]: {
				width: '20ch',
			},
			marginLeft: "50px !important"

		},
		sectionDesktop: {
			display: 'none',
			[theme.breakpoints.up('md')]: {
				display: 'flex',
			},
		},
		sectionMobile: {
			display: 'flex',
			[theme.breakpoints.up('md')]: {
				display: 'none',
			},
		},
		mapContainer: {
			position: "relative",
			width: '100%',
			height: '50vh'
		},
		map: {
			width: '100%',
			height: '50vh',
			position: "absolute"
		},
		mapView: {
			width: '100%',
			height: '100%'
		},
		mediaMap: {
			height: '50vh',
			position: "relative"
		},
		mapResetButton: {
			position: "absolute",
			bottom: "10px",
			right: "10px",
			zIndex: 100,
			background: alpha(theme.palette.common.white, 0.25)
		},
		paperMargin: {
			margin: '5px',
			padding: '5px'
		},
		channelPanel: {
			"min-width": '200px',
			"min-height": '100px'
		},
		channel: {
			width: '100%'
		},
		media: {
			height: '220px',
			backgroundSize: 'cover'
		},
		categoryAvatar: {
			backgroundColor: alpha(theme.palette.secondary.main, 1) + " !important"
		},
		formControl: {
			marginBottom: '10px !important',
			minWidth: 220,
		},
		selectEmpty: {
			marginTop: theme.spacing(2),
		},
		channelCardForm: {
			marginTop: '5px',
			marginBottom: '5px'
		},
		categoryResultsCard: {
			margin: '5px'
		},
		tags: {
			margin: theme.spacing(0, 2),
			padding: theme.spacing(0, 2),
			color: alpha(theme.palette.common.white, 1) + '!important'

		},
		viewTitle: {
			paddingTop: '10px',
			paddingBottom: '10px',
		},
		viewSection: {
			paddingTop: '10px',
			paddingBottom: '10px',
			fontSize: 16,
			color: alpha(theme.palette.secondary.dark, 1)
		},
		gridFull: {
			width: '100%'
		}
	})
);

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
	cluster: true, // true|false
	clusterCutOff: 8,
	clusterWidthMod: 25,
	siteTitle: "OUR LONDON",
	homeGrid: 3,
	homeCategorySearch: "Events",
	defaultZoom: 12,
	defaultPostcode: "E1",
	defaultLocation: [0.046499885910004, 51.5153355320004], // EPSG:3857
	defaultDistanceSelect: 'km', // km|mile
	defaultDistance: 10, // km|mile
	defaultMapIcon: iconDefault,
	websocket: "wss://locus1ws.nautoguide.com/new"
}

export {useStyles, channels, theme, configs};
