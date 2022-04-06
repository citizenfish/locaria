import {createTheme} from "@mui/material/styles";
import {makeStyles} from "@mui/styles";


const theme = createTheme({
	palette: {
		primary: {
			main: '#dcbd1d'
		},
		text: {
			primary: '#000'
		}
	}
});

const useStyles = makeStyles({
	adminDrawers: {
		'&	.MuiDrawer-paperAnchorDockedRight': {
			top: 140,
			width: "calc(100vw - 245px)",
			height: "calc(100vh - 140px)",
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