import React from 'react';

import Layout from './Layout';
import {useParams} from "react-router-dom";

const View = () => {
	let {feature} = useParams();

	const [view, setView] = React.useState(null);

	React.useEffect(() => {


		window.websocket.registerQueue("viewLoader",function(json) {
			setView(json);
		});

		window.websocket.send({
			"queue": "viewLoader",
			"api": "api",
			"data": {"method": "get_item", "fid": feature}
		});

	}, []);

	if (view !== null) {
		return (
			<Layout>
				<p>Feature: {feature}</p>
				<div>
					<h1>Detailed report</h1>
					<p>
						{view.packet.features[0].properties.title}
					</p>
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


export default View;