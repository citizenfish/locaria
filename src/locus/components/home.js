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
import { channels ,useStyles,configs} from "../../theme/locus";


import Layout from './Layout';

const Home = () => {
	const classes = useStyles();


	React.useEffect(() => {

	}, []);


	return (
		<Layout map={true}>

			<Paper elevation={3} className={classes.paperMargin}>
				<Grid container className={classes.root} spacing={2}>
						{channels.map(channel => (
							<Grid item xs={3}>


								<Card className={classes.root}>
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