import {alpha, makeStyles, createTheme} from '@material-ui/core/styles';
import {green, purple} from '@material-ui/core/colors';


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
			"height": '150px'
		},
		channel: {
			width: '100%'
		},
		media: {
			height: '220px',
			backgroundSize: '220px 220px'
		},
		categoryAvatar: {
			backgroundColor: alpha(theme.palette.secondary.main, 1) + " !important"
		},
		formControl: {
			margin: theme.spacing(1),
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
		}
	})
);
const channels=new Channels();
channels.addChannel('Planning',{
	"type": "Category",
	"name": "Planning",
	"description": "Find all Conservation Areas, Tree Preservation Orders, Listed Buildings and view Planning Applications received within the last 30 days.",
	"category": "Planning",
	"image": `${channelPlanning}`,
	"mapIcon": iconPlanning,
	"color": "#4a94e9"
});
channels.addChannel('Events',{
	"type": "Category",
	"name": "Events",
	"description": "A list of events and happenings running in your area",
	"category": "Events",
	"image": `${channelEvents}`,
	"mapIcon": `${iconEvents}`,
	"color": "#df7f2b",
	"tags":{
		"Arts":{
			"mapIcon": `${iconEvents}`,
			"color": "#df7f2b"
		}
	}

});
channels.addChannel('Crime',{
	"type": "Category",
	"name": "Crime",
	"description": "View Crime data, accessed via the Police Crime Data API. The data does not show cases within the last three months. Figures obtained from Police.UK.",
	"category": "Crime",
	"image": `${channelReported}`,
	"mapIcon": `${iconCrime}`,
	"color": "#c31d49",

});
channels.addChannel('Democracy',{
	"type": "Report",
	"name": "Democracy",
	"description": "Find information about wards, parishes, councillors, MPs, polling stations and council tax in your selected location.",
	"report_name": "democracy_location",
	"image": `${channelDemocracy}`,
	"mapIcon": `${iconDefault}`,
	"color": "#000000",

});
channels.addChannel('All',{
	"type": "Category",
	"name": "All",
	"description": "View all categories",
	"category": "*",
	"image": `${channelReported}`,
	"display": false,
	"mapIcon": `${iconDefault}`
});


const configs = {
	OSKey: "w69znUGxB6IW5FXkFMH5LQovdZxZP7jv",
	OSLayer: "Road_3857",
	cluster: true, // true|false
	clusterCutOff: 1.5,
	clusterWidthMod: 50,
	siteTitle: "Locus - My council",
	homeGrid: 3,
	homeCategorySearch: "*",
	defaultZoom: 12,
	defaultPostcode: "TQ1 4TN",
	defaultLocation: [-3.52130527563937, 50.5110125048114], // EPSG:3857
	defaultDistanceSelect: 'km', // km|mile
	defaultRange: 10, // km|mile
	websocket: "wss://cp90vff2qi.execute-api.eu-west-1.amazonaws.com/new"
}

export {useStyles, channels, theme, configs};
