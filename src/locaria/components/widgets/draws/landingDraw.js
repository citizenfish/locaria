import React, {useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Box, Drawer} from "@mui/material";
import {useStyles} from "stylesLocaria";
import {configs, theme, channels} from "themeLocaria";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Map from "../map";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ChannelSelect from "../channelSelect";
import {Footer} from "../footer";
import {useHistory} from "react-router-dom";
import {useCookies} from "react-cookie";
import {closeLandingDraw} from "../../redux/slices/landingDrawSlice";
import {closeSearchDraw, openSearchDraw} from "../../redux/slices/searchDrawSlice";
import {closeLayout} from "../../redux/slices/layoutSlice";
import {closeMultiSelect} from "../../redux/slices/multiSelectSlice";

const LandingDraw = function () {

	const open = useSelector((state) => state.landingDraw.open);

	const classes = useStyles();

	const mapRef = useRef();

	const history = useHistory();

	const [cookies, setCookies] = useCookies(['location']);

	const isInitialMount = useRef(true);

	const dispatch = useDispatch()


	React.useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			if (open === true) {
				history.push(`/`);
				dispatch(closeLayout());
				dispatch(closeSearchDraw());
				dispatch(closeMultiSelect());
			}
		}
	}, [open]);

	function handleKeyDown(e) {
		if (e.key === 'Enter') {
			doSearch();
		}
	}

	function doSearch() {
		let newSearchValue = document.getElementById('mySearch').value;
		//history.push(`/Search/[]/${newSearchValue}`);
		dispatch(openSearchDraw({categories: [],search:newSearchValue}));

	}

	React.useEffect(() => {
		mapRef.current.markHome(cookies.location);
		mapRef.current.zoomToLayersExtent(["data","location","home"]);

	});


	return (
		<Drawer
			anchor="bottom"
			open={open}
			className={classes.landingDraw}
			variant="persistent"
		>
			<Box className={classes.landingCallToAction}
			     display="flex"
			     flexDirection="column"
			     justifyContent="center"
			     alignItems="center">
				<Typography variant="h6" component="div">
					{configs.siteCallToAction}
				</Typography>
			</Box>
			<Grid container className={classes.landingLocation} spacing={1} justifyContent="center">
				<Grid item md={6} className={classes.landingLocationGrid}>
					<div className={classes.landingLocationPod}>
						<Map id={'landingMap'} ref={mapRef} speedDial={false} className={'landingMap'}/>
					</div>
				</Grid>
				<Grid item md={6} className={classes.landingLocationGrid}>
					<div className={classes.landingLocationPod}>
						<InputBase
							className={classes.searchDrawBox}
							id="mySearch"
							placeholder={configs.searchPlaceholder}
							variant="filled"
							onKeyDown={handleKeyDown}
						/>
						<IconButton onClick={() => {
							doSearch('new')
						}} type="submit" aria-label="search">
							<SearchIcon className={classes.icons}  />
						</IconButton>
					</div>

				</Grid>
			</Grid>
			<ChannelSelect></ChannelSelect>
			<Footer></Footer>
		</Drawer>
	)

}

export default LandingDraw;
