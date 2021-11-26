import {alpha, makeStyles, createTheme} from '@material-ui/core/styles';


// Channel Images
import channelSailor from './images/Sailor.png';
import searchMain from './images/main.jpg';

// Channel icons

import iconDefault from '../default/images/marker.svg';
import iconPlanning from '../default/images/marker-planning.svg';
import Channels from "../../locus/libs/Channels";
import UseStyles from "../default/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";


//https://next.material-ui.com/customization/palette/
const theme = createTheme({
	palette: {
		primary: {
			main: '#1c1c34',
		},
		secondary: {
			main: '#da801a',
		}
	}
});


const useStyles = new UseStyles(theme, {
	nmrnBannerImage: {
		backgroundColor: "rgba(24, 80, 89,.5)",
		backgroundBlendMode: "multiply",
		height: '220px',
		backgroundSize: 'cover'
	}
}).get();

const channels = new Channels();

channels.addChannel('Sailor', {
	"key": "Sailor",
	"type": "Report",
	"reportId": "get_nmrn_links",
	"name": "Sailors",
	"description": "Sailors",
	"category": "Sailors",
	"image": `${channelSailor}`,
	"mapIcon": iconPlanning,
	"color": "#4a94e9",
	"search": [],
});

channels.addChannel('Ship', {
	"key": "Ship",
	"type": "Report",
	"reportId": "get_nmrn_links",
	"name": "Ships",
	"description": "Ships",
	"category": "Ships",
	"image": `${channelSailor}`,
	"mapIcon": iconPlanning,
	"color": "#4a94e9",
	"search": [],
});
channels.addChannel('Memorial', {
	"key": "Memorial",
	"type": "Report",
	"reportId": "get_nmrn_links",
	"name": "Memorials",
	"description": "Memorials",
	"category": "Memorials",
	"image": `${channelSailor}`,
	"mapIcon": iconPlanning,
	"color": "#4a94e9",
	"search": [],
});
const configs = {
	mapXYZ: 'https://cartodb-basemaps-{a-d}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
	mapAttribution: "© OpenStreetMap contributors ©CARTO",
	mapBuffer: 50000,
	cluster: true, // true|false
	clusterCutOff: 1.5,
	clusterWidthMod: 50,
	siteTitle: "The National Museum of the Royal Navy",
	homeGrid: 3,
	homeCategorySearch: ["Ship", "Sailor", "Submarine", "Graveyard", "Homeport", "Memorial"],
	defaultZoom: 5,
	defaultPostcode: "E1",
	defaultLocation: [-582000, 7284000], // EPSG:3857
	defaultDistanceSelect: 'km', // km|mile
	defaultDistance: 10, // km|mile
	defaultMapIcon: iconDefault,
	websocket: "wss://mpk9us5un9.execute-api.eu-west-1.amazonaws.com/new", // Get his this from your locus-custom.yml - wsdomain
	cognitoURL: "locusauth.nautoguide.com", // Get his this from your locus-custom.yml - cognitoDomainName
	cognitoPoolId: "6jbgpggjvqonk7p55m51rql445", // Get from you api/.env
	searchIcon: searchMain,
	searchLimit: 20
}

export {useStyles, channels, theme, configs};
