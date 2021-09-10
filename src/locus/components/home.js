import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { channels ,useStyles} from "theme_locus";


import Layout from './Layout';

const Home = () => {
	const classes = useStyles();


	React.useEffect(() => {

	}, []);


	return (
		<Layout map={true}>

			<Paper elevation={3} className={classes.paperMargin}>
				<Grid container className={classes.root} spacing={2}  justifyContent="center">
						{channels.map(channel => (
							<Grid item md={3} className={classes.channel}>


								<Card className={classes.root}>
											<CardMedia
												className={classes.media}
												image={channel.image}
												title={channel.name}
											/>
											<CardContent className={classes.channelPanel}>
												<Typography gutterBottom variant="h5" component="h2">
													{channel.name}
												</Typography>
												<Typography variant="body2" color="textSecondary" component="p">
													{channel.description}
												</Typography>
											</CardContent>
									<CardActions>
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