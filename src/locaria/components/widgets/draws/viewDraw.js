import React, {forwardRef, useImperativeHandle, useRef} from "react";
import {Divider, Drawer, LinearProgress, useMediaQuery} from "@mui/material";
import {useStyles} from "stylesLocaria";
import {configs, theme} from "themeLocaria";
import {useCookies} from "react-cookie";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ShowReport from '../showReport';
import {useHistory} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux'
import {openSearchDraw,closeSearchDraw} from "../../redux/slices/searchDrawSlice";
import {closeMultiSelect} from "../../redux/slices/multiSelectSlice";

const ViewDraw = forwardRef((props, ref) => {
	const dispatch = useDispatch()
	const history = useHistory();

	const open = useSelector((state) => state.viewDraw.open);
	const fid = useSelector((state) => state.viewDraw.fid);

	const classes = useStyles();


	const isInitialMount = useRef(true);

	React.useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			if (open === true) {
				dispatch(closeSearchDraw());
				dispatch(closeMultiSelect());
			} else {
				props.mapRef.current.setSelected("default", "data", []);
				dispatch(openSearchDraw());
			}
		}
	}, [open]);


	React.useEffect(() => {
		if (fid !== false) {
			setReport(null);
			window.websocket.send({
				"queue": "viewLoader",
				"api": "api",
				"data": {"method": "get_item", "fid": fid}
			});
		}
	}, [fid]);


	const [report, setReport] = React.useState(null);


	React.useEffect(() => {

		window.websocket.registerQueue("viewLoader", function (json) {
			setReport(json.packet);
			history.push(`/View/${json.packet.features[0].properties.category}/${fid}`)
			props.mapRef.current.addGeojson(json.packet);
			props.mapRef.current.centerOnCoordinate(json.packet.features[0].geometry.coordinates, 15, "EPSG:4326");
			props.mapRef.current.setSelected("default", "data", [fid]);
		});

		return () => {
			window.websocket.removeQueue("viewLoader");
		}

	}, [report, fid]);


	return (
		<>
			<Drawer
				anchor="bottom"
				open={open}
				className={classes.viewDraw}
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
					{report !== null ? (
						<ShowReport viewData={report} fid={fid} mapRef={props.mapRef}/>) : (
						<LinearProgress/>)}
				</div>
			</Drawer>
		</>
	)
});

export {ViewDraw};