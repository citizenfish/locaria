import React from 'react';
import {useParams} from 'react-router-dom';

import Layout from './Layout';

const Report = () => {

	let {reportId} = useParams();
	const [report, setReport] = React.useState(null);

	React.useEffect(() => {

		window.websocket.registerQueue("historyReportRender", function (json) {
			setReport(json);
		});

		window.websocket.send({
			"queue": "historyReportRender",
			"api": "api",
			"data": {"method": "report", "report_name": reportId, "location": ""}
		});
	}, []);


	if (report !== null) {
		return (
			<Layout>
				<p>Reports page init: {reportId}</p>
				<div>
					<h1>the actual report</h1>
					<p>Something</p>
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



export default Report;