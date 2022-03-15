import React, {forwardRef, useImperativeHandle, useRef} from "react";
import {Divider, Drawer, LinearProgress, useMediaQuery} from "@mui/material";
import {useStyles} from "stylesLocaria";
import {configs, theme,channels} from "themeLocaria";
import {useCookies} from "react-cookie";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ViewFeature from './cards/viewFeature';
import {useHistory, useParams} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux'
import {openSearchDraw,closeSearchDraw} from "../../redux/slices/searchDrawSlice";
import {closeMultiSelect} from "../../redux/slices/multiSelectSlice";

const ViewDraw = forwardRef((props, ref) => {
	const dispatch = useDispatch()
	const history = useHistory();

	const open = useSelector((state) => state.viewDraw.open);
	const fid = useSelector((state) => state.viewDraw.fid);
	const category = useSelector((state) => state.viewDraw.category);

	const classes = useStyles();

	const [report, setReport] = React.useState(null);


	const isInitialMount = useRef(true);

	React.useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			if (open === true) {
				dispatch(closeSearchDraw());
				dispatch(closeMultiSelect());
				if (fid !== false) {
					let featureLoader={
						"queue": "viewLoader",
						"api": "api",
						"data": {"method": "get_item", "fid": fid}
					};
					let bulks=[featureLoader]
					let channel = channels.getChannelProperties(category);
					if(channel.report) {
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
				props.mapRef.current.setSelected("default", "data", []);
				dispatch(openSearchDraw());
				setReport(null);
			}
		}
	}, [open,fid]);


	React.useEffect(() => {

		window.websocket.registerQueue("bulkLoader", function (json) {
			setReport(json);
			history.push(`/View/${category}/${fid}`)
			props.mapRef.current.addGeojson(json.viewLoader.packet);
			if(json.reportLoader) {
				props.mapRef.current.addGeojson(json.reportLoader.packet);
			}
			props.mapRef.current.centerOnCoordinate(json.viewLoader.packet.features[0].geometry.coordinates, 15, "EPSG:4326");
			props.mapRef.current.setSelected("default", "data", [fid]);
		});

		return () => {
			window.websocket.removeQueue("bulkLoader");
		}

	}, [fid]);

	const ShowFeature = () => {
		if(report===null)
			return (<LinearProgress/>);
		return (
			<ViewFeature viewData={report} fid={fid} mapRef={props.mapRef} type={configs.viewDrawType}/>
		)
	}

	return (
			<Drawer
				anchor="bottom"
				open={open}
				className={configs.viewDrawType==='full'? classes.viewDrawFull:classes.viewDraw}
				variant="persistent"
			>
				<div className={classes.searchDrawHeader}>
					<Typography className={classes.viewDrawTitle} variant={'h5'}>{configs.viewTitle}</Typography>
					<IconButton onClick={()=>{dispatch(openSearchDraw());}} className={classes.viewDrawClose} type="submit"
								aria-label="search">
						<CloseIcon className={classes.icons}/>
					</IconButton>
				</div>
				<Divider className={classes.drawHeaderDivider}/>
				<div className={classes.viewDrawScroll}>
					<ShowFeature></ShowFeature>
				</div>
			</Drawer>
	)
});

export {ViewDraw};