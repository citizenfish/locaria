
import UseStyles from "./systemStyles";
import {theme} from "themeLocaria";

const useStyles = new UseStyles(theme, {
/*
	Custom styles go here
*/
	"nav":{
		backgroundColor: `${theme.palette.primary.main} !important`,
		borderRadius: '10px',
		width: '300px',
		position: 'absolute',
		zIndex: '150',
		left: 'calc(50% - 150px)',
		top: '55%'
	}

}).get();

export {useStyles};