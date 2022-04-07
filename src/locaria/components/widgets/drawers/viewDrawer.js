import React, {forwardRef, useImperativeHandle, useRef} from "react";
import {Container, Divider, Drawer, LinearProgress, useMediaQuery} from "@mui/material";
import {useStyles} from "stylesLocaria";
import {configs, theme, channels} from "themeLocaria";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import LinkIcon from '@mui/icons-material/Link';
import {useHistory, useParams} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux'
import {openSearchDrawer, closeSearchDrawer} from "../../redux/slices/searchDrawerSlice";
import {setPosition} from "../../redux/slices/viewDrawerSlice";
import {closeMultiSelect} from "../../redux/slices/multiSelectSlice";
import {FieldView} from '../fieldView'
import CardImageLoader from "../cardImageLoader";
import Share from "../share";
import SearchDrawerCard from "./cards/searchDrawerCard";
import {InView} from "react-intersection-observer";
import Grid from "@mui/material/Grid";
import Map from "../map";
import {closeLayout} from "../../redux/slices/layoutSlice";
import Button from "@mui/material/Button";


const ViewDrawer = forwardRef((props, ref) => {
	const dispatch = useDispatch()
	const history = useHistory();
	const localMapRef = useRef();

	const open = useSelector((state) => state.viewDraw.open);
	const fid = useSelector((state) => state.viewDraw.fid);
	const category = useSelector((state) => state.viewDraw.category);
	const more = useSelector((state) => state.viewDraw.more);
	const position = useSelector((state) => state.viewDraw.position);

	const classes = useStyles();

	const [report, setReport] = React.useState(null);

	let channel = channels.getChannelProperties(category);

	const isInitialMount = useRef(true);

	let actualMapRef=props.mapRef;
	if(configs.viewDrawType==='full')
		actualMapRef=localMapRef;

	React.useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			if (open === true) {
				history.push(`/View/${category}/${fid}`);
				dispatch(closeLayout());
				dispatch(closeSearchDrawer());
				dispatch(closeMultiSelect());
				if (fid !== false) {
					let featureLoader = {
						"queue": "viewLoader",
						"api": "api",
						"data": {"method": "get_item", "fid": fid}
					};
					let bulks = [featureLoader]
					if (channel.report) {
						bulks.push(
							{
								"queue": "reportLoader",
								"api": "api",
								"data": {
									"method": "report",
									"report_name": channel.report,
									"fid": fid
								}
							}
						)
					}

					window.websocket.sendBulk('bulkLoader', bulks);
				}
			} else {
				actualMapRef.current.setSelected("default", "data", []);
				dispatch(openSearchDrawer());
				setReport(null);
			}
		}
	}, [open, fid]);


	React.useEffect(() => {

		window.websocket.registerQueue("bulkLoader", function (json) {

			setReport(json);
			history.push(`/View/${category}/${fid}`)
			actualMapRef.current.addGeojson(json.viewLoader.packet, "data", true);
			if (json.reportLoader) {
				dispatch(setPosition({position: 10, more: json.reportLoader.packet.features.length > 10}));
				actualMapRef.current.addGeojson(json.reportLoader.packet, "data", false);
				actualMapRef.current.zoomToLayersExtent(["data"]);


			} else {
				actualMapRef.current.centerOnCoordinate(json.viewLoader.packet.features[0].geometry.coordinates, 15, "EPSG:4326");
			}
			actualMapRef.current.setSelected("default", "data", [fid]);
		});

		return () => {
			window.websocket.removeQueue("bulkLoader");
		}

	}, [fid]);

	const inViewEvent = function (event) {
		if (event === true) {
			dispatch(setPosition({
				position: position + 10,
				more: report.reportLoader.packet.features.length > (position + 10)
			}));
		}
	}

	const ShowFeature = () => {
		if (report === null)
			return (<LinearProgress/>);
		if (configs.viewDrawType === 'full') {
			return (
				<ShowFeatureFull/>
			)
		} else {
			return (
				<ShowFeatureBasic/>
			)
		}
	}

	const ShowFeatureFull = () => {
		return (
			<>
				<Grid container className={classes.ReportPageWrapper} spacing={2}>
					<Grid item md={4}>
						<Container className={classes.ReportProfileHeader}>
							<div className={classes.ReportProfileImageContainer}>
								<CardImageLoader className={classes.ReportProfileImage}
								                 images={report.viewLoader.packet.features[0].properties.description.images}
								                 defaultImage={channel.image ? channel.image : configs.defaultImage}
								                 gallery={true}/>

							</div>
							<Typography variant={"h6"} align={"center"}>{category}</Typography>
							<Divider/>
							<FieldView data={report.viewLoader.packet.features[0].properties}/>
							<Share />
						</Container>

					</Grid>
					<Grid item md={8}>
						<Container sx={{m:2,p:0}}>
							<Typography variant={"h6"}
										align={"center"}
							>
								{report.viewLoader.packet.features[0].properties.category}&nbsp;:&nbsp;{report.viewLoader.packet.features[0].properties.description.title}
							</Typography>
							<Divider/>
							<Grid container>
								{ report.viewLoader.packet.features[0].properties.description.url &&
								<>
										<Grid item md={8}>

											<Typography variant={"body1"}
														align={"left"}
														sx={{mt:1}}
											>
												{report.viewLoader.packet.features[0].properties.description.text}
											</Typography>
										</Grid>
										<Grid item md={4}>

												<Button
														variant = "outlined"
														onClick ={() => {
																window.open(report.viewLoader.packet.features[0].properties.description.url , '_blank')
														}}

												>
													Further information
												</Button>

										</Grid>
								</>
								}
								{
									report.viewLoader.packet.features[0].properties.description.url == undefined &&
									<Grid item md={12}>

										<Typography variant={"body1"}
													align={"left"}
													sx={{mt:1}}
										>
											{report.viewLoader.packet.features[0].properties.description.text}
										</Typography>
									</Grid>
								}
							</Grid>
						</Container>
						<Map id={'viewMap'} className={"ReportMap"} ref={localMapRef} speedDial={false}/>
					</Grid>
				</Grid>
				<ReportResults/>
			</>
		);
	}

	const ShowFeatureBasic = () => {
		return (
			<>
				<Container className={classes.ReportProfileHeader}>
					<div className={classes.ReportProfileImageContainer}>
						<CardImageLoader className={classes.ReportProfileImage}
						                 images={report.viewLoader.packet.features[0].properties.description.images}
						                 defaultImage={channel.image ? channel.image : configs.defaultImage}
						                 gallery={true}/>
					</div>
					<FieldView data={report.viewLoader.packet.features[0].properties}/>
					<Share/>
				</Container>
				<ReportResults/>

			</>
		);
	}

	const ReportResults = () => {
		if (report.reportLoader !== undefined) {

			let featuresCut = report.reportLoader.packet.features.slice(0, position);

			return (
				<>
					<Divider className={classes.ReportInfoDivider}/>
					<Typography className={classes.ReportProfileTitle}>Links</Typography>
					{featuresCut.map((item, index) => (
						<SearchDrawerCard key={index} {...item} mapRef={props.mapRef} full={true}/>
					))}

					{more ? (
						<div sx={{height: '10px'}}>
							<InView as="div" onChange={(inView, entry) => {
								inViewEvent(inView)
							}}>
							</InView>
							<LinearProgress/>
						</div>
					) : <div/>
					}
				</>
			)
		}
		return <></>
	}

	return (
		<Drawer
			anchor="bottom"
			open={open}
			className={configs.viewDrawType === 'full' ? classes.viewDrawFull : classes.viewDraw}
			variant="persistent"
		>
			<div className={classes.searchDrawHeader}>
				<Typography className={classes.viewDrawTitle} variant={'h5'}>{configs.viewTitle}</Typography>
				<IconButton onClick={() => {
					dispatch(openSearchDrawer());
				}} className={classes.viewDrawClose} type="submit"
				            aria-label="search">
					<CloseIcon className={classes.icons}/>
				</IconButton>
			</div>
			<Divider className={classes.drawHeaderDivider}/>
			<div className={classes.viewDrawScroll}>
				<ShowFeature/>
			</div>
		</Drawer>
	)
});

export {ViewDrawer};