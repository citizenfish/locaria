import {makeStyles} from "@mui/styles";
import {alpha} from '@mui/material/styles';
import {autocompleteClasses} from "@mui/material";
import {ellipse} from "@turf/turf";

export default class UseStyles {

	get() {
		return this.useStyles;
	}

	constructor(theme, merge = {}) {


		const leftWidth = 400;

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
				color: theme.palette.text.primary
			},

			iconsLight: {
				color: theme.palette.text.lighter
			},

			grow: {
				flexGrow: 1,
			},

			chip: {
				margin: "5px !important",
				color: `${theme.palette.text.clear} !important`
			},
			chipIcon: {
				color: `${theme.palette.text.clear} !important`
			},

			chipLight: {
				color: `${theme.palette.text.lighter} !important`
			},

			list: {
				color: theme.palette.text.lighter
			},

			/*
				Maintenance
			 */

			maintenance: {
				width: "95vw",
				height: "95vh",
				margin: "30px",
				padding: "10px"
			},


			typeAheadPopover: {
				maxHeight: "30vh"
			},

			/*
				Landing draw
			 */

			landingDraw:{
				overflowX: 'hidden',
				'&	.MuiDrawer-paperAnchorDockedBottom': {
					width: 'calc(100vw)',
					height: 'calc(100% - 64px)',
				},
			},

			landingMap: {
				width: "100%",
				height:"100%",
				position: "relative"
			},


			landingCallToAction: {
				width: "100vw",
				height: "20vh",
				backgroundColor: theme.palette.primary.darker,
				fontColor: theme.palette.text.primary
			},

			channelCallToAction: {
				width: "100vw",
				height: "10vh",
				padding: 10
			},

			landingLocation:{
			//	marginTop: "20px !important"
				backgroundColor: "rgb(246,245,243)"
			},

			landingLocationGrid: {
				textAlign: "center",
				width: "100%",
				color: theme.palette.text.lighter,
			},


			landingSearchBox: {
				color: `${theme.palette.text.lighter} !important`,
				border: `3px solid ${theme.palette.text.lighter}`,
				boxShadow: "3px 3px 5px 0 rgb(0 0 0 / 15%)",
				"& input": {
					padding: 20
				}
			},

			landingLocationPod: {
				height: "40vh",
				margin: 0,
				padding: 0,
				color: theme.palette.text.lighter

			},

			landingLocationPodSmall: {
				margin: 10,
				padding: 10,
				color: theme.palette.text.lighter

			},


			footer: {
				width: "100%",
				padding: 0,
				backgroundColor: theme.palette.primary.darker,
				fontColor: theme.palette.text.primary,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center"
			},

			footerLogo: {
				width: 170,
				height: 100,
				display: "inline-block",
				backgroundSize: "contain",
				marginTop: 20
			},

			footerList: {
				padding:0
			},
			footerLi: {
				float: "left",
				padding: 10,
				textDecoration: "none",
				listStyle: "none",
				'&:hover': {
					cursor:"pointer"
				}
			},

			footerBy: {
				"& a": {
					textDecoration: "none",
					color: theme.palette.text.primary
				}

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
				width: '100vw',
				position: 'fixed',
				zIndex: '150',
				top: 0,
				justifyContent: 'space-between !important',
				padding: '5px 0 !important',
				height: '65px !important'
			},
			NavSiteTitle: {
				width: "calc(100% - 120px)",
				borderLeft: "2px solid white",
				borderRight: "2px solid white",
			},
			NavSiteTitleText: {
				flexGrow: 1,
				textAlign: "center",
			},
			NavSiteSubTitleText: {
				flexGrow: 1,
				textAlign: "center",
			},
			NavMenuButton: {
				flex: '0 !important',
				padding: '10px !important',
			},
			NavSearchButton: {

				position: 'relative',
				flex: '0 !important',
				display: 'flex !important',
				borderRadius: '100px !important',
				justifyContent: 'center !important',
				alignItems: 'center !important',
				padding: '0 !important'
			},

			introModal: {
				outline: 'none',
				margin: '50px'
			},

			navIntroBox: {
				backgroundColor: `${theme.palette.primary.lighter}`,
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				maxWidth: 1000,
				borderRadius: '20px',
				padding: 20,
				overflow: 'hidden',
				border: 0,
				color: theme.palette.text.primary,
				outline: 'none'
			},
			navIntroInfo: {
				borderRadius: '10px',
				overflow: 'hidden',
				boxShadow: '4px 8px 11px -7px rgb(0 0 0 / 31%)',
			},
			navIntroActions: {
				paddingTop: 10,
			},
			preventShowCheckbox: {
				marginBottom: 10,
			},
			/*
				Profile speed dial on nav

			 */

			profileDial: {
				position: 'relative',
				"& .MuiFab-root": {
					boxShadow: '0px 0px 0px 0px !important'
				}
			},

			/* Dialogues */
			dialog: {
				"& .MuiPaper-root": {
					backgroundColor: alpha(theme.palette.primary.contrast,0.9),
					color: alpha(theme.palette.text.lighter, 1)
				}
			},

			dialogInput: {
				backgroundColor: theme.palette.primary.clear,
				"& input":{
					color: `${theme.palette.text.lighter} !important`
				}

			},

			dialogShareIcon: {
				"& :hover": {
					color: `${theme.palette.primary.darker} !important`,
					cursor: "pointer"
				}
			},

			/*
				Left Draw
			*/
			"drawLeft": {
				'& .MuiPaper-root': {
					backgroundColor: theme.palette.primary.main,
					color: theme.palette.icons.main,
					/*borderRadius: '0px 20px 20px 0px',*/
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
				Search Drawer
			 */

			searchDrawer: {

				overflow: 'hidden',
				'&	.MuiDrawer-paperAnchorDockedBottom': {
					//borderTopRightRadius: '20px',
					color: theme.palette.icons.main,
					//backgroundColor: theme.palette.primary.main,
					backgroundColor: alpha(theme.palette.primary.contrast,0.75),
					[theme.breakpoints.up('md')]: {
						left: 0,
						top: 65,
						maxWidth: leftWidth,

					},
					[theme.breakpoints.down('md')]: {
						left: 0,
						height: '60%',
						maxWidth: '100vw',
						bottom: 0,
						overflow: 'hidden',
					}
				},
				height: '100%'

			},

			searchDrawerHeader: {
				padding: 10,
				position: 'relative',
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				backgroundColor: theme.palette.primary.darker
			},

			searchDrawerTitle: {
				flex: 1,
				textAlign: 'center'
			},

			searchDrawerAccordionTitle: {
				flex: 1,
				textAlign: 'center',
				color: theme.palette.primary.darker
			},

			searchDrawerClose: {
				position: 'absolute'
			},

			searchDrawerSearch: {
				margin: 10,
				display: 'flex',
				overflow: 'hidden',
				padding: '12px 14px',
				backgroundColor: theme.palette.primary.clear,
				boxShadow: "0 2px 4px rgba(0,0,0,0.2),0 -1px 0px rgba(0,0,0,0.02)"
			},

			searchDrawerBox: {
				flex: 1,
				color: `${theme.palette.text.lighter} !important`,
			},
			searchDrawerAccordion:{
				margin: '0 !important'

			},
			searchDrawerResultList: {
				//padding: 20,
				paddingBottom: 0,
				display: 'flex',
				flexDirection: 'column'
			},

			searchDrawerResults: {
				//backgroundColor: theme.palette.primary.darker,
				backgroundColor: "white",
				flex: 1,
				display: 'flex',
				flexDirection: 'column',
				overflowY: 'auto'
			},

			searchDrawerNoResults: {
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				flex: 1
			},

			searchDrawerNoResultsIcon: {
				color: alpha(theme.palette.icons.main, 0.35),
				height: '128px',
				width: '128px'
			},

			searchDrawerNoResultsText: {
				color: 'rgba(255, 255, 255, 0.35)',
				marginTop: '12px',
				fontWeight: 200,
				fontSize: 24
			},

			SearchDrawImage: {
				width: '128px',
				height: '128px',
				marginRight: '10px'
			},

			SearchDrawNameText: {
				color: theme.palette.text.primary,
				fontSize: '0.9rem !important',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',
			},

			SearchDrawDivider: {
				marginTop: '5px !important',
				marginBottom: '5px !important'
			},

			SearchDrawerResultText: {
				color: alpha(theme.palette.text.lighter, 0.9),
				fontSize: '0.8rem !important',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',
				overflow: 'hidden',
			},

			SearchDrawerWrapper: {
				display: 'flex',
				flexDirection: 'row',
				overflow: 'hidden',
				height: '180px',
				marginBottom: '20px',
				backgroundColor: `${theme.palette.primary.main} !important`,
				borderRadius: '0px !important',
			},
			SearchDrawerLocationWrapper: {
				display: 'flex',
				flexDirection: 'row',
				overflow: 'hidden',
				backgroundColor: `${theme.palette.primary.clear} !important`,
				borderBottom: "black",
				borderBottomStyle: "solid",
				borderBottomWidth: "1px",
				borderRadius: "0px !important",
				//padding: "0px ! important",
				//margin: "0px !important"
			},
			SearchDrawerFeatureWrapper: {
				display: 'flex',
				flexDirection: 'row',
				overflow: 'hidden',
				backgroundColor: `${theme.palette.primary.clear} !important`,
				borderBottom: "black",
				borderBottomStyle: "solid",
				borderBottomWidth: "1px",
				borderRadius: "0px !important",
				//padding: "0px ! important",
				//margin: "0px !important"
				"& :hover": {
					backgroundColor: `${theme.palette.primary.contrast} !important`,
				}
			},

			SearchDrawMore: {
				display: 'flex',
				flexDirection: 'row',
				overflow: 'hidden',
				marginBottom: '20px',
				backgroundColor: `${theme.palette.primary.main} !important`
			},

			SearchLocationContent: {
				flex: 1,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'flex-start',
				justifyContent: 'stretch',
				overflow: 'hidden',
				color: `${theme.palette.primary.darker} !important`,
				paddingLeft: "20px",
				paddingTop: "5px",
				paddingBottom: "5px",
				'&:hover': {
					cursor:"pointer"
				}
			},

			SearchDrawContentSub: {
				height: 90,
				paddingLeft: '0px !important',
				paddingRight: '0px !important',
				width: '100%',
			},

			SearchDrawButton: {
				/*marginTop: '10px !important',
				marginRight: '10px',*/
				marginLeft: "28px !important",
				alignSelf: 'stretch',
				backgroundColor: `${theme.palette.secondary.main} !important`,
				color: `${theme.palette.text.primary} !important`,
			},

			SearchDrawButtonLocation: {
				margin: "10px !important",
				backgroundColor: `${theme.palette.secondary.main} !important`,
				color: `${theme.palette.text.primary} !important`,
			},

			searchFeatureIcon: {
				padding: 0,
				margin: "0 auto !important",
				width: 55,
				'& img': {
					width: '100%',
					maxWidth: 55,
					maxHeight:55,
					marginTop: 5
				}
			},

			searchTitle: {
				textTransform: "capitalize",
				textOverflow: "ellipsis"
			},

			searchText: {
				textOverflow: "ellipsis",
				maxHeight: 40,
				overflow: "hidden",
/*
				whiteSpace: "nowrap",
*/
				marginBottom: "5px !important"

			},

			searchDrawAdvancedAccordion: {
				backgroundColor: `${alpha(theme.palette.primary.contrast,0.75)} !important`,
				color: `${theme.palette.text.primary} !important`,
				overflowY: 'auto',
				overflowX: 'hidden'
			},

			searchCategoryChosen :{
				color: `${theme.palette.text.lighter} !important`
			},
			searchDistanceChosen:{
				color: `${theme.palette.text.lighter} !important`
			},
			searchTagsChosen: {
				color: `${theme.palette.text.lighter} !important`
			},
			searchDrawAdvancedAccordionDetails:{

			},

			searchDrawerAdvanced: {
				marginBottom: 0
			},

			searchDrawAdvancedButton: {
				padding: 8,
				position: 'relative'
			},

			/* Channels on home */

			channel: {
				textAlign: "center",
				width: "100%"
			},

			channelPod: {

				padding: 10,
				margin: 10,
				'& img': {
					width: '100%',
					maxWidth: 300
				}
			},

			channelDescription: {
				height: 80
			},

			channelPodSelected: {
				padding: 10,
				margin: 10,
				'& img': {
					width: '100%'
				},
				border: "1px solid red"
			},

			/* Mapping */

			mapAttribution: {
				position: "absolute",
				zIndex: 1,
				bottom: 5,
				right: 5,
				background: "rgba(255,255,255,0.9)",
				padding: 2,
				fontSize: "0.7rem",
				color: "black"
			},

			navfab:{
				borderRadius: "8px !important",
				backgroundColor: 'white !important'
			},

			fabText: {
				paddingLeft: 10
			},

			categorySelectText :{
				color: theme.palette.primary.darker,
				overflow:"ellipse"
			},

			categorySelectIcon : {
				width: 35,
				height: 35,
				"& img": {
					width: 35,
					height: 35
				}
			},

			tagSelectText :{
				color: theme.palette.primary.darker
			},

			tagFeatureCard :{
				backgroundColor: "theme.palette.secondary.main !important",
				fontSize: "0.6125rem !important",
				height: "22px !important",
				margin: "1px !important"
			},

			distanceSelectText: {
				color: theme.palette.primary.darker
			},

			resetCategorySelectText:{
				color: theme.palette.secondary.main,
				'&:hover': {
					cursor:"pointer"
				}
			},

			mapDial: {
				position: 'absolute',
				right: 20,
				bottom: 40
			},

			mapContainer: {
				position: "relative",
				width: '100%',
				height: '100vh'
			},
			mapContainerFull: {
				position: "relative",
				width: '100%',
				height: '100vh',
				[theme.breakpoints.down('md')]: {
					height: '100vh',
					overflow: 'hidden',
				}
			},
			map: {
				width: '100%',
				height: '50vh',
				position: "absolute"
			},
			mapView: {
				width: '100%',
				height: '100%',
				position: "relative"

			},
			mediaMap: {
				height: '50vh',
				position: "relative"
			},
			editMapView: {
				width: '100%',
				height: "40vh",
				position: "relative"
			},

			/*
			  View draw

			 */

			viewDraw: {
				overflow: 'hidden',
				'&	.MuiDrawer-paperAnchorDockedBottom': {
					color: theme.palette.icons.main,
					backgroundColor: theme.palette.primary.darker,
					width: 'calc(100vw)',
					height: 'calc(100% - 64px)',

					[theme.breakpoints.up('md')]: {
						maxWidth: leftWidth,
						left: 0
					},
					[theme.breakpoints.down('md')]: {
						maxWidth: '100vw',
						left: 0,
						overflow: 'hidden',
					}
				},
			},

			viewDrawFull:{
				overflow: 'hidden',
				'&	.MuiDrawer-paperAnchorDockedBottom': {
					color: theme.palette.icons.main,
					backgroundColor: theme.palette.primary.darker,
					width: 'calc(100vw)',
					height: 'calc(100% - 64px)',
				},
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
				overflowX: 'hidden',
				padding: 35
			},

			viewDrawTitle: {
				flex: 1,
				textAlign: 'center'
			},

			viewDrawClose: {
				position: 'absolute',

			},
            drawHeaderDivider: {
				borderColor: `${theme.palette.text.primary} !important`,
				opacity: .26,
			},
			pageDraw: {
				overflow: 'hidden',
				'&	.MuiDrawer-paperAnchorDockedBottom': {
					color: theme.palette.text.primary,
					backgroundColor: theme.palette.primary.darker,
				},
				height: '100%',
				bottom: 0,
				"& .MuiPaper-root": {
					padding: 10,
					height: "100%"
				}
			},

			/*
			  Reports page
			 */

			ReportPageWrapper: {
				backgroundColor: '#fdffff',
				color: '#000000',
				marginLeft: "0px !important"
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
			ReportMap: {
				height: "700px",
				width: "97%",
				margin: 10
			},
			ReportMapContainer: {
				position: "relative",
				margin: "0 auto",
				height: "100%",
				width: "100%"
			},
			ReportProfileHeader: {
				padding: '0 !important',
				marginBottom: '10px',
			},
			ReportProfileImageContainer: {
				borderRadius: '10px',
				overflowX: 'auto',
				display: 'flex',
				flexDirection: 'row',
				margin: "auto",
				width: "400px"
			},
			ReportProfileImage: {
				maxWidth: '330px',
				width: '100%',
				borderRadius: '10px',
				[theme.breakpoints.down('sm')]: {
					maxWidth: 'unset',
				}
			},
			ReportProfileTitle: {
				fontWeight: 200,
				fontSize: '1.4rem !important',
				marginTop: '10px !important',
				marginBottom: '10px !important',
				width: '100% !important',
			},
			ReportProfileText: {
				fontWeight: 100,
				padding: 0,
				color: alpha(theme.palette.text.lighter, 0.50),
				width: '100%',
				margin: 3
			},
			ReportProfilePText: {
				fontWeight: 100,
				padding: 0,
				color: alpha(theme.palette.text.lighter, 0.50)
			},
			ReportProfilePTitle:{
				fontWeight: 100,
				padding: 0,
				color: alpha(theme.palette.text.lighter, 1)
			},
			ReportProfilePButton: {
				margin: "20px !important"
			},
			ReportFurtherInformationText: {
				color: alpha(theme.palette.secondary.main, 1),
				'&:hover': {
					cursor:"pointer"
				}
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
					paddingLeft: 0
				},
				[theme.breakpoints.down('md')]: {
					paddingLeft: 0
				},
				flex: 1,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				margin: '0 0 15px 0 !important',
				color: alpha(theme.palette.text.primary, 1)
			},
			ReportMainInfoAccordion: {
				backgroundColor: `${theme.palette.primary.lighter} !important`,
				marginBottom: '20px !important',
				borderRadius: '4px !important',
			},
			ReportMainInfoAccordionSummary: {
				color: `${theme.palette.font1.main} !important`,
			},
			ReportMainInfoRow: {
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
				marginBottom: 10,
			},
			ReportMainInfoGrid: {
				marginTop: '0 !important',
				alignItems: 'center',
			},
			ReportMainInfoGridItem: {
				paddingTop: '0 !important',
			},
			ReportInfoIcon: {
				filter: 'invert(100%) sepia(100%) saturate(38%) hue-rotate(321deg) brightness(110%) contrast(110%)',
			},
			ReportIconRow: {
				paddingLeft: '0 !important',
				paddingRight: '0 !important',
				margin: '5px 0 5px !important'
			},
			ReportInfoText: {
				color: alpha(theme.palette.text.primary, 0.35),
				width: '100%'
			},
			ReportInfoTitle: {
				width: '100%'
			},
			ReportLinkButton: {
				width: 'calc(100% - 16px)',
				display: 'flex',
				marginTop: 10,
			},
			ShareButton: {

			},
			ReportInfoDivider: {
				marginTop: '20px !important',
				borderColor: `${theme.palette.primary.lighter} !important`,
				opacity: .26,
			},
			ReportProfileShip: {
				display: 'flex',
				flexDirection: 'column',
				marginBottom: '10px',
				width: '97%',
				backgroundColor: `${theme.palette.text.primary} !important`,
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

			linkerButton: {
				flex: 1,
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

			paperMargin: {
				margin: '5px',
				padding: '5px'
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
			},
			/* Admin */




		};
		base = Object.assign(base, merge);
		this.useStyles = makeStyles(base);
	}
}
