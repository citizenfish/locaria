import {makeStyles} from "@mui/styles";
import {alpha} from '@mui/material/styles';

export default class UseStyles {

	get() {
		return this.useStyles;
	}

	constructor(theme, merge = {}) {


		const leftWidth = 350;

		let base = {


			'@global': {
				'*::-webkit-scrollbar': {
					width: '0.6em'
				},
				'*::-webkit-scrollbar-track': {
					'-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
				},
				'*::-webkit-scrollbar-thumb': {
					backgroundColor: 'rgba(0,0,0,.1)',
					outline: '1px solid slategrey'
				}
			},
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

			"nav": {
				backgroundColor: `${theme.palette.primary.main} !important`,
				borderRadius: '10px',
				width: '300px',
				position: 'fixed',
				zIndex: '150',
				bottom: '40px',
				[theme.breakpoints.up('md')]: {
					right: 150
				},
				[theme.breakpoints.down('md')]: {
					right: 'calc(50% - 150px)',
				}
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
				color: `${theme.palette.primary.contrastText}`,
				outline: 'none'

			},

			/*
				Profile speed dial on nav

			 */

			profileDial: {
				position: 'relative', bottom: 11, right: 16, marginLeft: '30px',
				"& .MuiFab-root": {
					boxShadow: '0px 0px 0px 0px !important'
				}
			},

			/* Dialogues */
			dialog: {
				"& .MuiPaper-root": {
					backgroundColor: theme.palette.primary.main,
					color: alpha(theme.palette.primary.contrastText, 1)
				}
			},

			dialogInput: {
				backgroundColor: theme.palette.primary.lighter
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
						borderColor: alpha(theme.palette.icons.main, 0.2)
					}
				},

			},

			/*
				Search Draw
			 */

			"searchDraw": {

				overflow: 'hidden',
				'&	.MuiDrawer-paperAnchorDockedBottom': {
					borderTopRightRadius: '20px',
					color: theme.palette.icons.main,
					backgroundColor: theme.palette.primary.main,

					[theme.breakpoints.up('md')]: {
						left: 0,
						height: '100%',
						maxWidth: leftWidth,

					},
					[theme.breakpoints.down('md')]: {
						left: 0,
						height: '50%',
						maxWidth: '100vw',
					}
				},
				height: '100%'

			},

			searchDrawHeader: {
				padding: 10,
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
				position: 'absolute'
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
				color: alpha(theme.palette.icons.main, 0.35),
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
				fontSize: '1rem !important'
			},

			SearchDrawDivider: {
				marginTop: '5px !important',
				marginBottom: '5px !important'
			},

			SearchDrawShipText: {
				color: alpha(theme.palette.primary.contrastText, 0.35),
				fontSize: '1rem !important'
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
			SearchDrawContentSub: {
				height: 90,
				paddingLeft: '0px !important',
				paddingRight: '0px !important'
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
				'& img': {
					width: '100%'
				}
			},

			/* Mapping */

			mapDial: {
				position: 'absolute',
				right: 20,
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
			  View draw

			 */

			viewDraw: {
				overflow: 'hidden',
				'&	.MuiDrawer-paperAnchorDockedBottom': {
					borderTopRightRadius: '20px',

					height: '100%',
					color: theme.palette.icons.main,
					backgroundColor: theme.palette.primary.main,
					width: 'calc(100vw)',
					[theme.breakpoints.up('md')]: {
						maxWidth: leftWidth,
						left: 0
					},
					[theme.breakpoints.down('md')]: {
						maxWidth: '100vw',
						left: 0,


					}
				}
			},

			viewDrawHeader: {
				padding: 10,
				position: 'relative',
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center'
			},

			viewDrawScroll: {
				overflowY: 'auto',
				padding: 10
			},

			viewDrawTitle: {
				flex: 1,
				textAlign: 'center'
			},

			viewDrawClose: {
				position: 'absolute',

			},

			/*
			  Reports page
			 */

			ReportPageWrapper: {
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'flex-end',
				justifyContent: 'center',
				backgroundColor: '#192123',
			},
			ReportWrapper: {
				borderRadius: 0,
				padding: '20px',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				backgroundColor: '#232F34',
				[theme.breakpoints.up('md')]: {
					borderTopLeftRadius: '20px',
					borderTopRightRadius: '20px',
					maxWidth: '600px',
					paddingBottom: '150px'
				},
				[theme.breakpoints.down('md')]: {
					borderTopLeftRadius: 0,
					borderTopRightRadius: 0,
					maxWidth: 'calc(100vw - 40px)',
					paddingBottom: '20px'
				}
			},
			ReportProfileHeader: {
				display: 'flex',
				[theme.breakpoints.up('md')]: {
					flexDirection: 'column'
				},
				[theme.breakpoints.down('md')]: {
					flexDirection: 'column'
				},
				width: '92%',
				backgroundColor: `${theme.palette.primary.lighter} !important`,
				padding: 10,
				borderRadius: 20,
				marginBottom: '10px',
				overflow: 'hidden'

			},
			ReportProfileImageContainer: {
				borderRadius: '10px',
				overflowX: 'auto',
				display: 'flex',
				flexDirection: 'row',
			},
			ReportProfileImage: {

				width: '250px',
				height: '250px',
				borderRadius: '10px',
				margin: '10px 10px 10px 0',
			},
			ReportProfileTitle: {
				fontWeight: 200,
				fontSize: '1rem !important',
				marginTop: '10px !important',
				width: '100%',
				margin: '5px !important'
			},
			ReportProfileText: {
				fontWeight: 100,
				padding: 10,
				color: alpha(theme.palette.primary.contrastText, 0.35),
				width: '100%',
				margin: 3

			},
			ReportMainInfo: {
				[theme.breakpoints.up('md')]: {
					paddingLeft: 0
				},
				[theme.breakpoints.down('md')]: {
					paddingLeft: 0
				},
				flex: 1,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				margin: 10
			},
			ReportMainInfoExtra: {
				[theme.breakpoints.up('md')]: {
					paddingLeft: '20px'
				},
				[theme.breakpoints.down('md')]: {
					paddingLeft: 0
				},
				flex: 1,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				margin: 10,
				color: alpha(theme.palette.primary.contrastText, 1)
			},
			ReportMainInfoAccordion: {
				backgroundColor: `${theme.palette.primary.lighter} !important`,
				marginBottom: 10
			},
			ReportMainInfoRow: {
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
				marginBottom: 10,
			},

			ReportInfoText: {
				color: '#AAAAAA',
				width: '100%'
			},
			ReportInfoTitle: {
				width: '100%'
			},
			ReportShareButton: {
				alignSelf: 'stretch',
				top: 0,
				width: "100%"
			},
			ReportProfileShip: {
				display: 'flex',
				flexDirection: 'column',
				marginBottom: '10px',
				width: '97%',
				backgroundColor: `${theme.palette.primary.lighter} !important`,
				padding: 10,
				borderRadius: 20,
			},
			ReportHorizontalList: {
				overflowX: 'auto',
			},
			ReportListContent: {
				display: 'flex',
				flexDirection: 'row',
				width: 'fit-content',
			},
			ReportListItem: {
				width: '250px',
				height: '250px',
				borderRadius: '10px',
				overflow: 'hidden',
				margin: '10px 10px 10px 0',
			},
			ReportViewButton: {
				marginTop: '20px',
				alignSelf: 'flex-start',
				minWidth: '200px',
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
			/* Admin */

		};
		base = Object.assign(base, merge);
		this.useStyles = makeStyles(base);
	}
}