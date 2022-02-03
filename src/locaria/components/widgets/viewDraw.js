import React, {forwardRef, useImperativeHandle} from "react";
import {Divider, Drawer, LinearProgress, useMediaQuery} from "@mui/material";
import {useStyles} from "stylesLocaria";
import {configs, theme} from "themeLocaria";
import {useCookies} from "react-cookie";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ShowReport from './showReport';
import {useHistory} from "react-router-dom";

const ViewDraw = forwardRef((props, ref) => {
	const history = useHistory();

	const classes = useStyles();
	const [viewDraw, setViewDraw] = React.useState(false);
	const [fid, setFid] = React.useState(false);

	const openViewDraw = (fidLocal) => {
		setFid(fidLocal);
	}

	React.useEffect(() => {
		if (fid !== false) {
			forceUpdate(fid);
			setViewDraw(true);
		}
	}, [fid]);

	const closeViewDraw = () => {
		setViewDraw(false);
		props.mapRef.current.setSelected("default", "data", []);
		props.searchRef.current.openSearchDraw();
		setFid(false);

	}

	const [report, setReport] = React.useState(null);
	const [location, setLocation] = useCookies(['location']);


	React.useEffect(() => {

		window.websocket.registerQueue("viewLoader", function (json) {
			setReport(json.packet);
			props.mapRef.current.addGeojson(json.packet);
			props.mapRef.current.centerOnCoordinate(json.packet.features[0].geometry.coordinates, 15, "EPSG:4326");
			props.mapRef.current.setSelected("default", "data", [fid]);
		});

		return () => {
			window.websocket.removeQueue("viewLoader");
		}

	}, [report, fid]);

	const forceUpdate = () => {
		setReport(null);
		window.websocket.send({
			"queue": "viewLoader",
			"api": "api",
			"data": {"method": "get_item", "fid": fid}
		});

	}


	useImperativeHandle(
		ref,
		() => ({
			openViewDraw(fid) {
				return openViewDraw(fid);
			},
			closeViewDraw() {
				return closeViewDraw();
			}

		})
	)

	return (
		<Drawer
			anchor="bottom"
			open={viewDraw}
			className={classes.viewDraw}
			variant="persistent"
		>
			<div className={classes.searchDrawHeader}>
				<Typography className={classes.viewDrawTitle} variant={'h5'}>{configs.viewTitle}</Typography>
				<IconButton onClick={closeViewDraw} className={classes.viewDrawClose} type="submit"
				            aria-label="search">
					<CloseIcon className={classes.icons}/>
				</IconButton>
			</div>
			<Divider/>
			<div className={classes.viewDrawScroll}>
				{report !== null ? (
					<ShowReport viewData={report} viewWrapper={openViewDraw} fid={fid} mapRef={props.mapRef}/>) : (
					<LinearProgress/>)}
			</div>
		</Drawer>
	)
});

export {ViewDraw};