import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import {useHistory} from 'react-router-dom';
import {useStyles} from 'themeLocus';


import LayoutLeft from '../../../locus/components/widgets/layoutLeft';

const Home = () => {
	const classes = useStyles();
	const history = useHistory();

	return (
		<LayoutLeft map={true}>

			<Paper elevation={3} className={classes.paperMargin}>
				<Grid container className={classes.root} spacing={2} justifyContent="center">
					<h1>Bazinga</h1>
				</Grid>
			</Paper>
		</LayoutLeft>
	);
};


export default Home;