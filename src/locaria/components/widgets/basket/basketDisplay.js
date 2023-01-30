import React, {useRef} from "react";
import {Button, Stack, Toolbar} from "@mui/material";
import {useSelector} from "react-redux";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {newSearch, setFeatures} from "../../redux/slices/searchDrawerSlice";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';
import {setItems} from "../../redux/slices/basketSlice";
import Grid from "@mui/material/Grid";
import {useHistory} from "react-router-dom";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import {FieldView} from "widgets/data/fieldView";
import Notification from "widgets/utils/notification";

export default function BasketDisplay({field,printPage='/BasketPrint/',printMode=false}) {
	const dispatch = useDispatch();
	const features = useSelector((state) => state.searchDraw.features);
	const items = useSelector((state) => state.basketSlice.items);
	const history = useHistory();
	const ref=useRef();

	const date = new Date();
	const dayOfWeek = date.getDay();
	const daysUntilMonday = (dayOfWeek + 6) % 7;
	const beginningOfWeek = new Date(date.getTime() - daysUntilMonday * 24 * 60 * 60 * 1000);
	const dt=beginningOfWeek.toLocaleDateString('en-uk', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})

	useEffect(() => {
		if (items.length > 0) {
			dispatch(newSearch({categories: "*", fids: items, rewrite: false}));
		} else {
			dispatch(setFeatures(undefined));
		}
	}, [items]);

	useEffect(() => {
		window.websocket.registerQueue("sendEmail", function () {
			ref.current.open();
		})

	},[]);
	function sendEmail() {
		// Build a list of fids
		let fids = [];
		for(let f in features.features) {
			fids.push(features.features[f].properties.fid);
		}

		let packetEmail = {
			"queue": "sendEmail",
			"api": "api",
			"data": {
				"method":"report",
				"report_name":"send_email_prescription",
				"fids" : fids,
				"email_address" : "richard@nautoguide.com",
				"template": "end_user"
			}
		};

		window.websocket.send(packetEmail);

	}

	function BasketNav() {
		return (

			<Box
				sx={{
					width: "100%", mb: 1, height: '50%'
				}}
			>
				<Divider sx={{mb: 2}}/>
				<Typography align={"center"} variant={"h6"}>Week Beginning: {dt}</Typography>
				<Divider sx={{mt: 2}}/>
				<Typography sx={{marginTop:"10px"}} align={"center"} variant={"h6"}>Use the short codes by typing  <b>mytl.link</b> into your browser</Typography>
				<Divider sx={{mt: 2}}/>

			</Box>
		);
	}

	if (features && features.features && features.features.length > 0) {
		let featureArray = [];
		features.features.forEach((feature) => {
			featureArray.push(
				<FieldView data={feature} mode={"read"} fields={field}></FieldView>
			);
		});
		return (
			//TODO add print and email functionality
			<>
				<Notification notification={`Email sent`} ref={ref}/>
				<BasketNav/>
				{featureArray}
				<Typography align={"center"} variant={"h6"} sx={{marginTop: "10px"}}>Brilliant!
					That’s {features.features.length} activities for next week. Keep it up!</Typography>

				{!printMode &&
					<Toolbar sx={{justifyContent: "center", marginTop: "10px"}}>
						<Button startIcon={<ClearAllIcon/>} onClick={() => dispatch(setItems([]))}>Clear</Button>
						<Button startIcon={<PrintIcon/>} onClick={() => history.push(printPage)}>Print</Button>
						<Button startIcon={<EmailIcon/>} onClick={() => sendEmail()}>Email</Button>
					</Toolbar>
				}
				{printMode &&
					<Toolbar sx={{justifyContent: "center", marginTop: "10px"}}>
						<Button startIcon={<PrintIcon/>} onClick={() => window.print()}>Print</Button>
					</Toolbar>
				}

			</>
		);
	} else {
		return (
			//TODO PLEASE MOVE THIS TEXT TO CONFIG
			//TODO remove hardcoded image as per searchLocationFiltersNoResults.js
			<Stack>

				<Box
					component={"img"}
					sx={{
						width: "100%", mb: 1, height: '50%'
					}}
					src="http://activeprescriptiondev.myactiveprescription.com/assets/bfa57a48-4c35-4eb2-9fcc-e42bd2b940df.jpg"
				/>
				<Grid container
					  direction="column"
					  alignItems="center"
					  justifyContent="center">
					<Grid item md={6}>
						<p>You do not have any items in your Active Prescription</p>
					</Grid>
					<Grid item md={6}>
						<Button variant={"outlined"}
								sx={{width: '200px'}}
								onClick={() => {
									history.push("/")
								}}>
							{/* TODO reset filters when this is selected*/}
							Search
						</Button>
					</Grid>
				</Grid>

			</Stack>
		);
	}
}
