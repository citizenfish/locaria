import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';
import {channels, useStyles, configs} from "theme_locus";


import Layout from './Layout';

const Home = () => {
	const classes = useStyles();


	React.useEffect(() => {

	}, []);


	return (
		<Layout map={true}>

			<Paper elevation={3} className={classes.paperMargin}>
				<Grid container className={classes.root} spacing={2} justifyContent="center">
					{channels.listChannels().map(function (channel) {
							const chan=channels.getChannelProperties(channel);
							if(chan.display!==false) {
								return (
									<Grid item md={configs.homeGrid} className={classes.channel}>


										<Card className={classes.root}>
											<CardMedia
												className={classes.media}
												image={chan.image}
												title={chan.name}
											/>
											<CardContent className={classes.channelPanel}>
												<Typography gutterBottom variant="h5" component="h2" style={{color: `${chan.color}`}} >
													{chan.name}
												</Typography>
												<Typography variant="body2" color="textSecondary" component="p">
													{chan.description}
												</Typography>
											</CardContent>
											<CardActions>
												<Link to={`/${chan.type}/${channel}`}>
													<Button size="small" color="secondary" variant="outlined">
														View
													</Button>
												</Link>
											</CardActions>
										</Card>


									</Grid>

								)
							} else {
								return '';
							}
						}
					)}
				</Grid>
			</Paper>
		</Layout>
	);
};


export default Home;