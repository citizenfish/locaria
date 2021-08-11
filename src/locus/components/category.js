import React from 'react';
import {useParams} from 'react-router-dom';
import Define from '@nautoguide/ourthings-react/Define';

const DEFINE = new Define();
import Layout from './Layout';
import {channels} from "../../theme/locus";

const Category = () => {

	let {category} = useParams();
	const [report, setReport] = React.useState(null);

	React.useEffect(() => {
		window.queue.commandsQueue([
				{
					options: {
						queueRun: DEFINE.COMMAND_INSTANT
					},
					queueable: "Websockets",
					command: "websocketSend",
					json: {
						"message": {
							"queue": "categoryLoader",
							"api": "api",
							"data": {"method": "search", "category": category}
						}
					}
				},
				// We have a report
				{
					options: {
						queuePrepare: "categoryLoader"
					},
					queueable: "Internals",
					command: "run",
					json:  function () {
							setReport('foobar');
					}

				}
			]
		);
	}, []);

	if (report !== null) {
		return (
			<Layout>
				<p>Category: {category}</p>
				<CategoryActual></CategoryActual>
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


const CategoryActual = () => {
	return (
		<div>
			<h1>the actual report</h1>
			<ul>
			{memory.categoryLoader.value.packet.features
				.map(feature => (
				<li>{feature.properties.title}</li>
			))}
			</ul>
		</div>
	)
}


export default Category;