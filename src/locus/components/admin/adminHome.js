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
import {channels, useStyles, configs} from 'themeLocus';


import Layout from '../Layout';
import {useCookies} from "react-cookie";

const AdminHome = () => {
	const classes = useStyles();
	const [cookies, setCookies] = useCookies(['location']);


	return (
		<Layout map={false}>
			<Paper elevation={3} className={classes.paperMargin}>
				<Grid container className={classes.root} spacing={2} justifyContent="center">
					<h1>Admin home</h1>
				</Grid>
			</Paper>
		</Layout>
	);
};


export default AdminHome;