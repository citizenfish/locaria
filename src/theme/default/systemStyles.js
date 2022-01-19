import {makeStyles} from "@mui/styles";
import {alpha} from '@mui/material/styles';

export default class UseStyles {

	get() {
		return this.useStyles;
	}

	constructor(theme, merge = {}) {
		let base = {
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

			/*
			  The Nav bar
			 */

			"nav":{
				backgroundColor: `${theme.palette.primary.main} !important`,
				borderRadius: '10px',
				width: '300px',
				position: 'fixed',
				zIndex: '100',
				left: 'calc(50% - 150px)',
				bottom: '40px',
				'& .MuiSvgIcon-root ':{
/*
					color: theme.palette.primary.fontColor
*/
				},
				'& button:nth-child(2)':{
				}
			},

			/*
				Left Draw
			*/
			"drawLeft": {
				'& .MuiPaper-root': {
					backgroundColor: theme.palette.primary.main,
					color: theme.palette.icons.main,
					borderRadius: '0px 20px 20px 0px',
					paddingRight: '40px',
					'& .MuiSvgIcon-root': {
						color: theme.palette.icons.main
					},
					'& .MuiDivider-root': {
						borderColor: alpha(theme.palette.icons.main,0.2)
					}
				},

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
				height: '65vh'
			},
			mapContainerFull: {
				position: "relative",
				width: '100%',
				height: '98vh'
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
				position: "absolute !important",
				top: "10px",
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
			searchResults: {
				width: '100%',
				height: '100%'
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
			},
			imageList: {
				/*width: 500,
				height: 300,*/
			}
		};
		base = Object.assign(base, merge);
		this.useStyles = makeStyles(base);
	}
}