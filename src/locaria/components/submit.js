import React from 'react';

import Layout from './widgets/layout';
import Map from './widgets/map';
import ChannelCard from './widgets/channelCard';

import {useParams, useHistory} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {channels, configs, useStyles} from "themeLocaria";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Openlayers from "libs/Openlayers";
import {viewStyle} from "./mapStyles/view"
import {useCookies} from "react-cookie";

import AutoForm from "./widgets/autoForm";

const Submit = () => {
	let {category} = useParams();
	let channel = channels.getChannelProperties(category);
	const classes = useStyles();
	const ol = new Openlayers();
	const [cookies, setCookies] = useCookies(['location']);
	const [properties, setProperties] = React.useState({description: {}, tags: []});

	const history = useHistory();


	React.useEffect(() => {

		ol.addMap({
			"target": "map",
			"projection": "EPSG:3857",
			"renderer": ["canvas"],
			"zoom": 10,
			center: configs.defaultLocation
		});
		ol.addLayer({
			"name": "xyz",
			"type": "xyz",
			"url": `https://api.os.uk/maps/raster/v1/zxy/${configs.OSLayer}/{z}/{x}/{y}.png?key=${configs.OSKey}`,
			"active": true
		});
		ol.addLayer({
			"name": "data",
			"type": "vector",
			"active": true,
			"style": viewStyle
		});


	}, []);

	const cancel = () => {
		history.goBack();
	}

	function addFeature() {
		const geometry = document.getElementById('geo-id').value;
		window.websocket.send({
			"queue": "saveFeature",
			"api": "sapi",
			"data": {
				"method": "add_item",
				"attributes": properties,
				"table": channel.submit,
				"category": category,
				"geometry": geometry,
				"id_token": cookies['id_token']
			}
		})
		;

	}

	return (
		<Layout>
			<Grid container className={classes.root} spacing={6}>
				<Grid item md={4}>
					<Paper elevation={3} className={classes.paperMargin}>
						<ChannelCard path={'/Category/' + category}></ChannelCard>
					</Paper>
				</Grid>
				<Grid item md={8}>
					<Paper elevation={3} className={classes.paperMargin}>
						<Card className={classes.root}>
							<CardContent>

								<CardMedia
									className={classes.mediaMap}
									title={category}
								>
									<Map ol={ol}></Map>
								</CardMedia>
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
		</Layout>
	);

};


export default Submit;