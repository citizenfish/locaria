import React, {forwardRef, useImperativeHandle} from "react";
import {Divider, Drawer, LinearProgress, useMediaQuery} from "@mui/material";
import {useStyles} from "stylesLocaria";
import {configs,theme} from "themeLocaria";
import {useCookies} from "react-cookie";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ShowReport from 'defaults/showReport';
import {useHistory} from "react-router-dom";

const ViewDraw = forwardRef((props, ref) => {
	const history = useHistory();

	const classes = useStyles();
	const [viewDraw, setViewDraw] = React.useState(false);
	const [fid, setFid] = React.useState(false);

	const toggleViewDraw = (fidLocal,force = false) => {
		if(!viewDraw||force===true) {
			//setReportId(reportIdLocal);
			setFid(fidLocal);
			//forceUpdate(reportIdLocal,fidLocal);
			forceUpdate(fidLocal);
		}
		setViewDraw(force===true? true:!viewDraw);
	}

	const closeViewDraw = () => {
		setViewDraw(false);
		history.push(`/Search/`);

	}

	const [report, setReport] = React.useState(null);
	const [location, setLocation] = useCookies(['location']);

	React.useEffect(() => {

		window.websocket.registerQueue("viewLoader", function (json) {
			setReport(json.packet);
		});


		return () => {
			window.websocket.clearQueues();
		}

	}, [report]);

	const forceUpdate = (fidLocal) => {
		setReport(null);
		window.websocket.send({
			"queue": "viewLoader",
			"api": "api",
			"data": {"method": "get_item", "fid": fidLocal}
		});

	}


	useImperativeHandle(
		ref,
		() => ({
			toggleViewDraw(fid) {
				return toggleViewDraw(fid);
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
				{report!==null? (<ShowReport viewData={report} viewWrapper={toggleViewDraw} fid={fid}/>):(<LinearProgress/>)}
			</div>
		</Drawer>
	)
});

export {ViewDraw};