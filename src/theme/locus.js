import {alpha, makeStyles,createTheme} from '@material-ui/core/styles';
import {green, purple} from '@material-ui/core/colors';

// Fixed images
import marker from '../locus/components/images/marker.svg';

// Channel Images
import channelPlanning from './images/channel-planning.jpg';
import channelDemocracy from './images/channel-democracy.jpg';
import channelEvents from './images/channel-events.jpg';
import channelReported from './images/channel-reported.jpg';


//https://next.material-ui.com/customization/palette/
const theme = createTheme({
	palette: {
		primary: {
			main: '#eccb1c',
		},
		secondary: {
			main: '#f44336',
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
			padding: theme.spacing(1, 1, 1, 0),
			// vertical padding + font size from searchIcon
			paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
			transition: theme.transitions.create('width'),
			width: '100%',
			[theme.breakpoints.up('md')]: {
				width: '20ch',
			},
			"margin-left": '50px'

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
		pointer: {
			width: '100%',
			height: '50vh',
			"background-image": `url('${marker}')`,
			"background-size": "75px 113px",
			"background-position": "center",
			"background-repeat": "no-repeat",
			position: "absolute"
		},
		map: {
			width: '100%',
			height: '50vh',
			position: "absolute"
		},
		paperMargin: {
			margin: '5px'
		},
		channelPanel: {
			"min-with": '200px',
			"min-height": '150px'
		},
		media: {
			height: '220px'
		}
	})
);

const channels = [
	{
		"type": "Category",
		"key": "chanPlanning",
		"name": "Planning",
		"description": "Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica",
		"category": "Planning",
		"image": `${channelPlanning}`
	},
	{
		"type": "Category",
		"key": "chanAll",
		"name": "All",
		"description": "Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica",
		"category": "*",
		"image": `${channelEvents}`
	},
	{
		"type": "Category",
		"key": "chanReported",
		"name": "Reported",
		"description": "Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica",
		"category": "Reported",
		"image": `${channelReported}`
	},
	{
		"type": "Report",
		"key": "chanDemocracy",
		"name": "Democracy",
		"description": "Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica",
		"report_name": "democracy_location",
		"image": `${channelDemocracy}`
	}
];

export {useStyles, channels, theme};
