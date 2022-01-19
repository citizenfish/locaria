import React from 'react';
import Paper from '@mui/material/Paper';

import {pages} from 'themeLocaria';
import {useStyles} from "stylesLocaria";


import Layout from './widgets/layout';
import {useParams} from "react-router-dom";

const Page = () => {
	const classes = useStyles();
	let {page} = useParams();

	const pageData=pages.getPageData(page);

	return (
		<Layout>
			<Paper elevation={3} className={classes.paperMargin}>
				{pageData}
			</Paper>
		</Layout>
	);
};


export default Page;