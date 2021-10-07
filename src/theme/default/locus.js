import {alpha, makeStyles, createTheme} from '@material-ui/core/styles';


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
import Channels from "../../locus/libs/Channels";
import iconArts from "../london/images/icons/marker-arts-selected.svg";
import iconCommunity from "../london/images/icons/marker-community-selected.svg";
import iconDance from "../london/images/icons/marker-dance-selected.svg";
import iconEducational from "../london/images/icons/marker-educational-selected.svg";
import iconMusic from "../london/images/icons/marker-music-selected.svg";
import iconSport from "../london/images/icons/marker-sport-selected.svg";
import iconTech from "../london/images/icons/marker-tech-selected.svg";


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
			"min-height": '150px'
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

const tags = {
	"Full": {
		"mapIcon": `${iconArts}`,
		"color": "#df7f2b"
	},
	"Conditions": {
		"mapIcon": `${iconCommunity}`,
		"color": "#e95814"
	},
	"Outline": {
		"mapIcon": `${iconDance}`,
		"color": "#792d89"
	},
	"Heritage": {
		"mapIcon": `${iconEducational}`,
		"color": "#14587e"
	},
	"Amendment": {
		"mapIcon": `${iconMusic}`,
		"color": "#9e125b"
	},
	"Trees": {
		"mapIcon": `${iconSport}`,
		"color": "#0f8e47"
	},
	"Other": {
		"mapIcon": `${iconTech}`,
		"color": "#1aabe3"
	}
};


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
	"tags": tags

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


const configs = {
	OSKey: "w69znUGxB6IW5FXkFMH5LQovdZxZP7jv",
	OSLayer: "Road_3857",
	cluster: true, // true|false
	clusterCutOff: 1.5,
	clusterWidthMod: 50,
	siteTitle: "Locus - My council",
	homeGrid: 3,
	homeCategorySearch: ["Planning", "Events", "Crime"],
	defaultZoom: 12,
	defaultPostcode: "TQ1 4TN",
	defaultLocation: [-3.52130527563937, 50.5110125048114], // EPSG:3857
	defaultDistanceSelect: 'km', // km|mile
	defaultDistance: 10, // km|mile
	defaultMapIcon: iconDefault,
	websocket: "wss://mpk9us5un9.execute-api.eu-west-1.amazonaws.com/new", // Get his this from your locus-custom.yml - wsdomain
	cognitoURL: "locusauth.nautoguide.com", // Get his this from your locus-custom.yml - cognitoDomainName
	cognitoPoolId: "6jbgpggjvqonk7p55m51rql445" // Get from you api/.env
}

export {useStyles, channels, theme, configs};
