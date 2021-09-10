import {alpha, makeStyles, createTheme} from '@material-ui/core/styles';
import {green, purple} from '@material-ui/core/colors';


// Channel Images

import channelArt from './images/Arts.png';
import channelGeneral from './images/General.png';
import channelCommunity from './images/Community.png';
import channelMusic from './images/Music.png';


//https://next.material-ui.com/customization/palette/
const theme = createTheme({
	palette: {
		primary: {
			main: '#353d42',
		},
		secondary: {
			main: '#238328',
		},
	},
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
			backgroundColor: alpha(theme.palette.secondary.main,1)+" !important"
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

const channels = [
	{
		"type": "Category",
		"key": "Events",
		"name": "Art",
		"description": "Find all Art events in your local area.",
		"category": "Events",
		"image": `${channelArt}`
	},
	{
		"type": "Category",
		"key": "Community",
		"name": "Community",
		"description": "Find all Community events in your local area.",
		"category": "Community",
		"image": `${channelCommunity}`
	},
	{
		"type": "Category",
		"key": "Music",
		"name": "Music",
		"description": "Find all Music events in your local area.",
		"category": "Music",
		"image": `${channelMusic}`
	},
	{
		"type": "Report",
		"key": "Search",
		"name": "Search",
		"description": "Advanced search",
		"report_name": "search_location",
		"image": `${channelGeneral}`
	}
];

const configs = {
	OSKey: "vmRzM4mAA1Ag0hkjGh1fhA2hNLEM6PYP",
	OSLayer: "Light_3857",
	siteTitle: "MAYOR OF LONDON",
	defaultZoom: 12,
	defaultPostcode: "E1",
	defaultLocation: [0.046499885910004,51.5153355320004], // EPSG:3857
	defaultDistanceSelect: 'km', // km|mile
	defaultRange: 10, // km|mile
	websocket: "wss://cp90vff2qi.execute-api.eu-west-1.amazonaws.com/new"
}

export {useStyles, channels, theme, configs};
