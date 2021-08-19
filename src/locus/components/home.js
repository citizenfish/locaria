import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { channels ,useStyles} from "../../theme/locus";

import Openlayers from "../libs/Openlayers";


import Layout from './Layout';

const Home = () => {
	const classes = useStyles();


	React.useEffect(() => {
		const ol=new Openlayers();
		ol.addMap({"target":"map","projection":"EPSG:3857","renderer":["canvas"],"zoom":10,center:[-447255.32888684,7332420.40741905]});
		ol.addLayer({"name":"xyz","type":"xyz","url":"https://api.os.uk/maps/raster/v1/zxy/Light_3857/{z}/{x}/{y}.png?key=w69znUGxB6IW5FXkFMH5LQovdZxZP7jv","active":true});

	}, []);


	return (
		<Layout>
			<Paper elevation={3} className={classes.paperMargin}>
				<div className={classes.mapContainer+" no-controls"}>
					<div id="map" className={classes.map}></div>
					<div id="pointer" className={classes.pointer}></div>
				</div>
			</Paper>
			<Paper elevation={3} className={classes.paperMargin}>
				<Grid container className={classes.root} spacing={2}>
						{channels.map(channel => (
							<Grid item xs={3}>


								<Card className={classes.root}>
									<CardActionArea>
										<CardMedia
											className={classes.media}
											image={channel.image}
											title="Contemplative Reptile"
										/>
										<CardContent>
											<Typography gutterBottom variant="h5" component="h2">
												{channel.name}
											</Typography>
											<Typography variant="body2" color="textSecondary" component="p">
												{channel.description}
											</Typography>
										</CardContent>
									</CardActionArea>
									<CardActions>
										<Button size="small" color="primary">
											Share
										</Button>
										<Link to={`/${channel.type}/${channel.key}`}>
											<Button size="small" color="primary">
												View
											</Button>
										</Link>
									</CardActions>
								</Card>


							</Grid>

						))}
				</Grid>
			</Paper>
		</Layout>
	);
};


export default Home;