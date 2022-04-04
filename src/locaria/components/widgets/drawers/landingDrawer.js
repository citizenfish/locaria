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
import ChannelSelect from "../selectors/categorySelect";
import {Footer} from "../footer";
import {useHistory} from "react-router-dom";
import {useCookies} from "react-cookie";
import {closeSearchDrawer, openSearchDrawer} from "../../redux/slices/searchDrawerSlice";
import {closeLayout} from "../../redux/slices/layoutSlice";
import {closeMultiSelect} from "../../redux/slices/multiSelectSlice";
import {closeViewDraw} from "../../redux/slices/viewDrawerSlice";
import TypeAhead from "../typeAhead";
import {closeTypeAhead, openTypeAhead} from "../../redux/slices/typeAheadSlice";
import Button from "@mui/material/Button";

const LandingDrawer = function () {

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
				dispatch(closeSearchDrawer());
				dispatch(closeViewDraw());
				dispatch(closeMultiSelect());
			}
		}




		window.websocket.registerQueue("typeAheadLoader", function (json) {
			if(json.packet&&json.packet.results&&json.packet.results!==null)
				dispatch(openTypeAhead(json.packet.results));
			else
				dispatch(closeTypeAhead());
		});

	}, [open]);

	function handleChange(e) {
		setSearch(e.target.value);
	}

	function handleKeyUp(e) {
		console.log(e.target.value);
		if (e.key === 'Enter') {
			dispatch(closeTypeAhead());
			doSearch();
		} else {
			if (e.target.value.length > 2) {
				window.websocket.send({
					"queue": "typeAheadLoader",
					"api": "api",
					"data": {
						"method": "search",
						"typeahead": true,
						"search_text": e.target.value
					}
				});
			} else {
				dispatch(closeTypeAhead());
			}
		}
	}

	function doSearch() {
		dispatch(openSearchDrawer({categories: [], search: search}));

	}

	React.useEffect(() => {
		mapRef.current.markHome(cookies.location);
		mapRef.current.zoomToLayersExtent(["data", "location", "home"]);

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
				<Typography variant="h4" component="div">
					{configs.siteCallToAction}
				</Typography>
				<Typography variant="body2" component="div" sx={{mt:1}}>
					{configs.siteSubCallToAction}
				</Typography>
			</Box>
			<Grid container className={classes.landingLocation} spacing={0} justifyContent="center">
				<Grid item md={12} className={classes.landingLocationGrid}>
					<div className={classes.landingLocationPod}>
						<Map id={'landingMap'} ref={mapRef} speedDial={false} className={'landingMap'}/>
					</div>
				</Grid>
				<Grid item md={12} className={classes.landingLocationGrid}>
					<div className={classes.landingLocationPodSmall}>
						<Typography variant="body1" component="div" sx={{mb:1}}>
							{configs.searchInstruction}
						</Typography>
						<InputBase
							className={classes.landingSearchBox}
							id="landingSearch"
							placeholder={configs.searchPlaceholder}
							variant="filled"
							onKeyUp={handleKeyUp}
							onChange={handleChange}
							value={search}
							autoComplete={'off'}
							autoFocus={true}

						/>

						<TypeAhead anchorId={"landingSearch"}></TypeAhead>
						<p>
							<Button size="medium" color="secondary" variant="contained" endIcon={<SearchIcon/>} onClick={() => {
								doSearch()
							}}>Search</Button>
						</p>
					</div>

				</Grid>
			</Grid>
			<ChannelSelect/>
			<Footer/>
		</Drawer>
	)

}

export default LandingDrawer;
