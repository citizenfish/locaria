import {alpha, makeStyles, createTheme} from '@material-ui/core/styles';

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

const useStyles = new UseStyles(theme).get();

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
	"tags": tags,
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
	OSAttribution: "© Crown copyright and database rights 2021 OS 123456",
	cluster: true, // true|false
	clusterCutOff: 1.5,
	clusterWidthMod: 50,
	siteTitle: "Locus - My council",
	homeGrid: 3,
	homeCategorySearch: ["Planning", "Events", "Crime"],
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
