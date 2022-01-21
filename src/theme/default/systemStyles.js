import {makeStyles} from "@mui/styles";
import {alpha} from '@mui/material/styles';

export default class UseStyles {

	get() {
		return this.useStyles;
	}

	constructor(theme, merge = {}) {
		let base = {

			/*
				Defaults
			 */

			icons: {
				color: theme.palette.icons.main
			},



			grow: {
				flexGrow: 1,
			},


			/*
			  Possibly legacy
			 */

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
				zIndex: '150',
				left: 'calc(50% - 150px)',
				bottom: '40px'
			},

			modal: {
				outline: 'none'
			},

			navIntroBox: {
				backgroundColor: `${theme.palette.primary.lighter}`,
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				width: '80vw',
				maxWidth: 600,
				borderRadius: '10px 10px 10px 10px',
				padding: 10,
				border: 0,
				color:  `${theme.palette.primary.contrastText}`,
				outline: 'none'

			},

			/*
				Profile speed dial on nav

			 */

			profileDial: {
				position: 'relative', bottom: 11, right: 16 ,marginLeft: '30px',
				"& .MuiFab-root": {
					boxShadow: '0px 0px 0px 0px !important'
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

			/*
				Search Draw
			 */

			"searchDraw": {
				borderTopLeftRadius: '20px',
				borderTopRightRadius: '20px',
				overflow: 'hidden',
				'&	.MuiDrawer-paperAnchorDockedBottom': {
					height:'50%',
					maxWidth: 500,
					color: theme.palette.icons.main,
					backgroundColor: theme.palette.primary.main,
					width: 'calc(100vw)',
					left: 'auto'
				}
			},

			"searchDrawDesktop": {
				borderTopLeftRadius: '20px',
				borderTopRightRadius: '20px',
				overflow: 'hidden',
				'&	.MuiDrawer-paperAnchorDockedBottom': {
					height:'50%',
					maxWidth: 500,
					color: theme.palette.icons.main,
					backgroundColor: theme.palette.primary.main,
					width: 'calc(100vw)',
					right: 'calc(50vw - 250px)',
					bottom: 200,
					left: 'auto'
				}
			},

			searchDrawHeader: {
				padding: 20,
				position: 'relative',
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center'
			},

			searchDrawTitle: {
				flex: 1,
				textAlign: 'center'
			},

			searchDrawClose: {
				position: 'absolute',
				right: 12,
				top: 16
			},

			searchDrawSearch: {
				margin: 20,
				display: 'flex',
				borderRadius: '6px',
				overflow: 'hidden',
				padding: '12px 14px',
				backgroundColor: theme.palette.primary.lighter
			},

			searchDrawBox: {
				flex: 1,
			},

			searchDrawResultList: {
				padding: 20,
				paddingBottom: 0,
				display: 'flex',
				flexDirection: 'column'
			},

			searchDrawResults: {
				backgroundColor: theme.palette.primary.main,
				borderTopLeftRadius: '20px',
				borderTopRightRadius: '20px',
				flex: 1,
				display: 'flex',
				flexDirection: 'column',
				overflowY: 'auto'
			},

			searchDrawNoResults: {
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				flex: 1
			},

			searchDrawNoResultsIcon: {
				color: alpha(theme.palette.icons.main,0.35),
				height: '128px',
				width: '128px'
			},

			searchDrawNoResultsText: {
				color: 'rgba(255, 255, 255, 0.35)',
				marginTop: '12px',
				fontWeight: 200,
				fontSize: 24
			},

			SearchDrawImage: {
				width: '128px',
				height: '128px',
				marginRight: '20px'
			},

			SearchDrawNameText: {
				color: theme.palette.primary.contrastText,
				fontSize: '18px !important'
			},

			SearchDrawShipText: {
				color: alpha(theme.palette.primary.contrastText,0.35),
				fontSize: '16px !important'
			},

			SearchDrawWrapper: {
				display: 'flex',
				flexDirection: 'row',
				borderRadius: '10px',
				overflow: 'hidden',
				height: '128px',
				marginBottom: '20px',
				backgroundColor: `${theme.palette.primary.lighter} !important`
			},

			SearchDrawContent: {
				flex: 1,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'flex-start',
				justifyContent: 'stretch',
				padding: '10px 10px 10px 0'
			},

			SearchDrawButton: {
				marginTop: '10px',
				marginRight: '10px',
				alignSelf: 'stretch'
			},

			/* Channels on home */

			channelPod: {
				border: `1px solid ${theme.palette.primary.main}`,
				borderRadius: `10px 10px 10px 10px`,
				padding: 10,
				margin: 10,
				height: '30vh',
				'& img':{
					width:'100%'
				}
			},

			/* Mapping */

			mapDial: {
				position: 'absolute',
				left: 20,
				top: 20
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
			/*
			  Other
			 */

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