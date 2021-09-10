import {alpha, makeStyles, createTheme} from '@material-ui/core/styles';
import {green, purple} from '@material-ui/core/colors';


// Channel Images

import channelPlanning from './images/channel-Planning.png';
import channelCommunity from './images/channel-Community.png';
import channelDemocracy from './images/channel-Democracy.png';
import channelCrime from './images/channel-Crime.png';
import channelHighways from './images/channel-Highways.png';
import channelEducation from './images/channel-Education.png';




//https://next.material-ui.com/customization/palette/
const theme = createTheme({
	palette: {
		primary: {
			main: '#32AA39',
		},
		secondary: {
			main: '#393939',
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
		"key": "Planning",
		"name": "Planning",
		"description": "Find all Conservation Areas, Tree Preservation Orders, Listed Buildings and view Planning Applications received within the last 30 days.",
		"category": "Planning",
		"image": `${channelPlanning}`
	},
	{
		"type": "Category",
		"key": "Community",
		"name": "Community",
		"description": "Find community halls, toilets, playgrounds nearest to your selected location.",
		"image": `${channelCommunity}`
	},
	{
		"type": "Category",
		"key": "Democracy",
		"name": "Democracy",
		"description": "Find information about wards, parishes, councillors, MPs, polling stations and council tax in your selected location.",
		"category": "Democracy",
		"image": `${channelDemocracy}`
	},
	{
		"type": "Category",
		"key": "Crime",
		"name": "Crime",
		"description": "View Crime data, accessed via the Police Crime Data API. The data does not show cases within the last three months. Figures obtained from Police.UK.",
		"category": "Crime",
		"image": `${channelCrime}`
	},
	{
		"type": "Category",
		"key": "Highways",
		"name": "Highways",
		"description": "Find information on Surrey Heath Borough Council maintained car parks.",
		"category": "Highways",
		"image": `${channelHighways}`
	},
	{
		"type": "Category",
		"key": "Education",
		"name": "Education",
		"description": "Find schools near to your location and access Ofsted reports. For more information on admissions, appeals, and schools transport visit Surrey County Council.",
		"category": "Education",
		"image": `${channelEducation}`
	}
];

const configs = {
	OSKey: "wam0hEeJVZtrZT8H6NCZNtVo7kXaHang",
	OSLayer: "Light_3857",
	siteTitle: "Surrey Heath Borough Council",
	defaultZoom: 14,
	defaultPostcode: "GU15 3HD",
	defaultLocation: [-0.743166424536075,51.3394703242612], // EPSG:3857
	defaultDistanceSelect: 'km', // km|mile
	defaultRange: 10, // km|mile
	websocket: "wss://cp90vff2qi.execute-api.eu-west-1.amazonaws.com/new"
}

export {useStyles, channels, theme, configs};
