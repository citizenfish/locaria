import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {Link, useParams, useLocation} from 'react-router-dom';
import {channels, useStyles, configs} from 'themeLocaria';
import Openlayers from "libs/Openlayers";


import AdminLayout from './adminLayout';
import Map from '../widgets/map';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import FormControl from "@material-ui/core/FormControl";
import LinearProgress from "@material-ui/core/LinearProgress";
import {useCookies} from "react-cookie";
import AdminCard from "./adminCard";
import AutoForm from "../widgets/autoForm"
import {viewStyle} from "../mapStyles/view";
import SearchTags from "../search/SearchTags";

const AdminData = () => {
	const classes = useStyles();

	const [tables, setTables] = React.useState(null);
	const [cookies, setCookies] = useCookies(['location']);
	const [category, setCategory] = React.useState(null);
	const [properties, setProperties] = React.useState({description: {}, tags: []});

	const ol = new Openlayers();

	window.websocket.registerQueue("tablesLoader", function (json) {
		console.log(json.packet.tables);
		setTables(json.packet.tables);
	});

	window.websocket.registerQueue("saveFeature", function (json) {
		setCategory(null);
	});


	function handleClose() {

	}

	function handleMapClick(e) {
		const coordinate = e.coordinate;
		const wktCoordinate = 'SRID=3857;' + ol.coordinatesToWKT({"coordinate": coordinate});
		console.log(wktCoordinate);
		document.getElementById('geo-id').value = wktCoordinate;
	}

	function handleChange(e) {
		setCategory(e.target.value)
		window.websocket.send({
			"queue": "tablesLoader",
			"api": "sapi",
			"data": {
				"method": "get_tables",
				"category": e.target.value,
				"id_token": cookies['id_token']
			}
		});
	}


	const cancel = () => {
		setCategory(null);
	}

	function onChangeTags(newTags) {
		//debugger;
		console.log(newTags);
		properties.tags = newTags;
	}

	function addFeature() {
		const geometry = document.getElementById('geo-id').value;
		window.websocket.send({
			"queue": "saveFeature",
			"api": "sapi",
			"data": {
				"method": "add_item",
				"attributes": properties,
				"table": tables[0],
				"category": category,
				"geometry": geometry,
				"id_token": cookies['id_token']
			}
		})
		;

	}

	if (category !== null) {
		if (tables !== null) {
			return (
				<AdminLayout>
					<Grid container className={classes.root} spacing={6}>
						<Grid item md={4}>
							<Paper elevation={3} className={classes.paperMargin}>
								<AdminCard></AdminCard>
							</Paper>
						</Grid>
						<Grid item md={8}>
							<Paper elevation={3} className={classes.paperMargin}>
								<Card className={classes.root}>
									<CardContent>
										<CardMedia
											className={classes.mediaMap}
											title="map"
										>
											<Map ol={ol} handleMapClick={handleMapClick}></Map>

										</CardMedia>
										<SearchTags category={category}
										            changeFunction={onChangeTags}
										            currentValue={properties.tags}></SearchTags>
										<AutoForm category={category} properties={properties.description}></AutoForm>
									</CardContent>
									<CardActions>
										<Button size="small" color="secondary" onClick={cancel} variant="outlined">
											Cancel
										</Button>
										<Button size="small" color="secondary" onClick={addFeature} variant="outlined">
											Add
										</Button>
									</CardActions>
								</Card>
							</Paper>
						</Grid>
					</Grid>
				</AdminLayout>
			)
		} else {
			return (
				<AdminLayout>
					<LinearProgress/>
				</AdminLayout>
			)
		}
	} else {
		return (
			<AdminLayout>
				<Grid container className={classes.root} spacing={6}>
					<Grid item md={4}>
						<Paper elevation={3} className={classes.paperMargin}>
							<AdminCard></AdminCard>
						</Paper>
					</Grid>
					<Grid item md={8}>
						<Paper elevation={3} className={classes.paperMargin}>
							<Card className={classes.root}>
								<CardContent>
									<Typography variant="h5" component="h2" className={classes.viewTitle}>
										Select category
									</Typography>
									<FormControl className={classes.formControl} fullWidth>

										<InputLabel id="filter-channel-select-label">Select Channel</InputLabel>
										<Select
											labelId="filter-channel-select-label"
											id="channel-select"
											value=""
											onChange={handleChange}
											onClose={handleClose}
											input={<Input/>}
											renderValue={(selected) => selected.join(', ')}
										>
											{channels.listChannels().map(function (channel) {
												const chan = channels.getChannelProperties(channel);
												return (
													<MenuItem key={chan.key} value={chan.name}>
														<Checkbox/>
														<ListItemText primary={chan.name}></ListItemText>
													</MenuItem>)
											})}

										</Select>
									</FormControl>
								</CardContent>
							</Card>
						</Paper>
					</Grid>
				</Grid>
			</AdminLayout>
		);
	}
};


export default AdminData;