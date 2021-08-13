import React from 'react';
import {Link, useParams} from 'react-router-dom';

import Layout from './Layout';

const Category = () => {

	let {category} = useParams();
	const [report, setReport] = React.useState(null);

	React.useEffect(() => {

		window.websocket.registerQueue("categoryLoader",function(json) {
			setReport(json);
		});

		window.websocket.send({
			"queue": "categoryLoader",
			"api": "api",
			"data": {"method": "search", "category": category}
		});

	}, []);

	if (report !== null) {
		return (
			<Layout>
				<p>Category: {category}</p>
				<div>
					<h1>the actual report</h1>
					<ul>
						{report.packet.features
							.map(feature => (
								<Link to={`/View/${feature.properties.fid}`} key={feature.properties.fid}>{feature.properties.title}</Link>
							))}
					</ul>
				</div>
			</Layout>
		);
	} else {
		return (
			<Layout>
				<p>Loading</p>
			</Layout>
		)
	}

};

export default Category;