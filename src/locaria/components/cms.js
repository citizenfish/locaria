import React from 'react';

import Layout from './widgets/layout';
import MDEditor from "@uiw/react-md-editor";
import {useStyles} from "stylesLocaria";
import ReactDOM from "react-dom";
import ContactForm from "./widgets/contactForm";
import {Footer} from "./widgets/footer";

const CMS = () => {
	const classes = useStyles();

	const page='Home';
	const [pageData, setPageData] = React.useState(undefined);

	const getPageData = () => {
		window.websocket.send({
			"queue": "getPageData",
			"api": "api",
			"data": {
				"method": "get_parameters",
				"parameter_name": `page_${page}`
			}
		});
	}

	React.useEffect(() => {
		getPageData();
	},[]);

	React.useEffect(() => {
		if (document.getElementById('layout')) {
			//ReactDOM.render(<Layout map={true} fullscreen={true}/>, document.getElementById('layout'));
			//ReactDOM.render(<ContactForm/>, document.getElementById('layout'));
			ReactDOM.render(<ContactForm/>, document.getElementById('layout'));
		}
	});


	window.websocket.registerQueue('getPageData', (json) => {
		setPageData(json.packet[`page_${page}`]);
	});

	if (pageData) {
		return (
			<MDEditor.Markdown source={pageData.data} className={classes.pageDrawMD}/>

			/*<Layout map={true} fullscreen={true}>
            </Layout>*/
		)
	} else {
		return (<></>)
	}
};


export default CMS;