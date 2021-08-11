import React from 'react';
import {useParams} from 'react-router-dom';
import Define from '@nautoguide/ourthings-react/Define';

const DEFINE = new Define();
import Layout from './Layout';

const Report = () => {

	let {reportId} = useParams();
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
							"queue": "historyReportRender",
							"api": "api",
							"data": {"method": "report", "report_name": reportId, "location": ""}
						}
					}
				},
				// We have a report
				{
					options: {
						queuePrepare: "historyReportRender"
					},
					queueable: "Internals",
					command: "run",
					json: {
						"func": function () {
							setReport('foobar');
						},
						"foo": "bar"
					}

				}
			]
		);
	}, []);

	if (report !== null) {
		return (
			<Layout>
				<p>Reports page init: {reportId}</p>
				<ReportActual>{report}</ReportActual>
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


const ReportActual = ({children}) => {
	return (
		<div>
			<h1>the actual report</h1>
			<p>{children}</p>
		</div>
	)
}


export default Report;