import React, {forwardRef, useImperativeHandle} from "react";
import {Divider, Drawer, useMediaQuery} from "@mui/material";
import {useStyles} from "stylesLocaria";
import {configs,theme} from "themeLocaria";
import {useCookies} from "react-cookie";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ShowReport from 'defaults/showReport';

const ViewDraw = forwardRef((props, ref) => {

	const classes = useStyles();
	const [viewDraw, setViewDraw] = React.useState(false);
	const [reportId, setReportId] = React.useState(false);
	const [fid, setFid] = React.useState(false);

	const toggleViewDraw = (type,category,reportIdLocal,fidLocal) => {
		if(!viewDraw) {
			setReportId(reportIdLocal);
			setFid(fidLocal);
			forceUpdate(reportIdLocal,fidLocal);
		}
		setViewDraw(!viewDraw);
	}

	const [report, setReport] = React.useState(null);
	const [location, setLocation] = useCookies(['location']);

	React.useEffect(() => {

		window.websocket.registerQueue("bulk1", function (json) {
			setReport(json);
		});


		return () => {
			window.websocket.clearQueues();
		}

	}, [report]);

	const forceUpdate = (reportIdLocal,fidLocal) => {
		setReport(null);
		window.websocket.sendBulk('bulk1',[{
			"queue": "feature",
			"api": "api",
			"data": {"method": "get_item", "fid": fidLocal}
		},
			{
				"queue": "links",
				"api": "api",
				"data": {
					"method": "report",
					"report_name": reportIdLocal,
					"location": `SRID=4326;POINT(${location.location[0]} ${location.location[1]})`,
					"fid": fidLocal
				}
			}
		]);
	}


	useImperativeHandle(
		ref,
		() => ({
			toggleViewDraw(type,category,reportId,fid) {
				return toggleViewDraw(type,category,reportId,fid);
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
				<IconButton onClick={toggleViewDraw} className={classes.viewDrawClose} type="submit"
				            aria-label="search">
					<CloseIcon className={classes.icons}/>
				</IconButton>
			</div>
			<Divider/>
			<ShowReport reportId={reportId} reportData={report}/>
		</Drawer>
	)
});

export {ViewDraw};