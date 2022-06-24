import {createTheme} from "@mui/material/styles";
import {makeStyles} from "@mui/styles";


const theme = createTheme({
	palette: {
		primary: {
			main: '#dcbd1d'
		},
		secondary: {
			main: '#328FFD',
			lighter: '#d7f6d7'
		},
		text: {
			primary: '#000'
		},
		selection: {
			main: "rgb(189,123,41)",
			lighter: "rgba(189,123,41,0.9)",
		}
	}
});

const useStyles = makeStyles({
	adminDrawers: {
		'&	.MuiDrawer-paperAnchorDockedRight': {
			top: 64,
			width: "calc(100vw - 240px)",
			height: "calc(100vh - 64px)",
			overflowY:"auto"
		}
	},
	formControl: {
		marginBottom: '10px !important',
		marginTop: '10px !important',
		minWidth: 220,
	},

	editButtons: {
		margin: 5
	}

});


export {useStyles,theme};