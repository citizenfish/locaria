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
import {closeSearchDraw, openSearchDraw} from "../../redux/slices/searchDrawSlice";
import {closeLayout} from "../../redux/slices/layoutSlice";
import {closeMultiSelect} from "../../redux/slices/multiSelectSlice";
import {closeViewDraw} from "../../redux/slices/viewDrawSlice";

const LandingDraw = function () {

	const open = useSelector((state) => state.landingDraw.open);

	const classes = useStyles();

	const mapRef = useRef();

	const history = useHistory();

	const [cookies, setCookies] = useCookies(['location']);

	const isInitialMount = useRef(true);

	const dispatch = useDispatch()

	const [search, setSearch] = React.useState('');


	React.useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			if (open === true) {
				history.push(`/`);
				dispatch(closeLayout());
				dispatch(closeSearchDraw());
				dispatch(closeViewDraw());
				dispatch(closeMultiSelect());
			}
		}
	}, [open]);

	function handleChange(e) {
		setSearch(e.target.value);
	}

	function handleKeyDown(e) {
		if (e.key === 'Enter') {
			doSearch();
		}
	}

	function doSearch() {
		dispatch(openSearchDraw({categories: [],search:search}));

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
						<Typography variant="h6" component="div">
							Search for a location or thing
						</Typography>
						<InputBase
							className={classes.landingSearchBox}
							id="mySearch"
							placeholder={configs.searchPlaceholder}
							variant="filled"
							onKeyDown={handleKeyDown}
							onChange={handleChange}
							value={search}
						/>
						<IconButton onClick={() => {
							doSearch()
						}} type="submit" aria-label="search">
							<SearchIcon className={classes.iconsLight}  />
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
