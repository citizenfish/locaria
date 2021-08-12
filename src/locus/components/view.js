import React from 'react';
import Define from '@nautoguide/ourthings-react/Define';

const DEFINE = new Define();
import Layout from './Layout';

const View = () => {

	const [view, setView] = React.useState(null);

	React.useEffect(() => {
		window.queue.commandsQueue([
				{
					options: {
						queueRun: DEFINE.COMMAND_INSTANT,
						queueRegister: 'wsActive'
					},
					queueable: "Websockets",
					command: "websocketSend",
					json: {
						"message": {
							"queue": "categoryLoader",
							"api": "api",
							"data": {"method": "search", "category": view}
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
							setView(true);
					}

				}
			]
		);
	}, []);

	if (view !== null) {
		return (
			<Layout>
				<p>Feature: {feature}</p>
				<ViewActual></ViewActual>
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


const ViewActual = () => {
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


export default View;